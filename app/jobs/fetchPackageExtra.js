/**
 * Fetch package extra data
 **/

const cheerio = require("cheerio");
const config = require("config");
const urljoin = require("url-join");
const PackageExtra = require("../models/packageExtra");
const PackageFeed = require("../models/packageFeed");
const {
  loadPackageNames,
  loadPackage,
  packageExists
} = require("../utils/package");
const { renderMarkdownToHtml } = require("../utils/markdown");
const { AxiosService } = require("../utils/http");
const logger = require("../utils/log")(module);

/**
 * Fetch package extra data into redis for given packageNames array.
 * @param {Array} packageNames
 */
const fetchExtraData = async function(packageNames) {
  logger.info("fetchExtraData");
  if (!packageNames) packageNames = [];
  for (let packageName of packageNames) {
    // Verify package
    if (!packageExists(packageName)) {
      logger.error({ pkg: packageName }, "package doesn't exist");
      continue;
    }
    // Load package
    const pkg = await loadPackage(packageName);
    await _fetchPackageInfo(packageName);
    await _fetchStars(pkg.repo, packageName);
    await _fetchOGImage(pkg, packageName);
    await _fetchReadme(pkg, packageName);
  }
};

/**
 * Return HTTP error info object
 * @param {Object} error
 * @param {Object} others
 */
const httpErrorInfo = function(err, others) {
  // Show http status if possible or fallback to error
  if (err.response && err.response.status)
    return { status: err.response.status, ...others };
  else return { err, ...others };
};

/**
 * Return if error has given status code.
 * @param {Object} error
 * @param {Number} code
 */
const isErrorCode = function(error, code) {
  return error.response && error.response.status == code;
};

/**
 * Fetch package info from the registry.
 * @param {string} repo
 * @param {string} packageName
 */
const _fetchPackageInfo = async function(packageName) {
  try {
    const resp = await AxiosService.create().get(
      urljoin("https://package.openupm.com", packageName),
      {
        headers: { Accept: "application/json" }
      }
    );
    const pkgInfo = resp.data;
    const version = pkgInfo["dist-tags"].latest;
    const versionInfo = pkgInfo.versions[version];
    // Save the unity version.
    const unityVersion = /^[0-9]{4,4}\.[0-9]/i.test(versionInfo.unity)
      ? versionInfo.unity
      : "";
    await PackageExtra.setUnityVersion(packageName, unityVersion);
    // Save the update time.
    const timeStr = pkgInfo.time[version] || 0;
    const time = new Date(timeStr).getTime();
    await PackageExtra.setUpdatedTime(packageName, time);
    // Save the package version.
    await PackageExtra.setVersion(packageName, version);
  } catch (error) {
    logger.error(
      httpErrorInfo(error, { pkg: packageName }),
      "fetch package info error"
    );
  }
};

/**
 * Fetch repository stars.
 * @param {string} repo
 */
const _fetchStars = async function(repo, packageName) {
  try {
    const headers = { Accept: "application/vnd.github.v3.json" };
    if (config.gitHub.token)
      headers.authorization = `Bearer ${config.gitHub.token}`;
    const resp = await AxiosService.create().get(
      urljoin("https://api.github.com/repos/", repo),
      { headers }
    );
    const repoInfo = resp.data;
    const stars = repoInfo.stargazers_count || 0;
    await PackageExtra.setStars(packageName, stars);
    if (repoInfo.parent) {
      const pstars = repoInfo.parent.stargazers_count || 0;
      await PackageExtra.setParentStars(packageName, pstars);
    }
  } catch (error) {
    logger.error(
      httpErrorInfo(error, { pkg: packageName }),
      "fetch stars error"
    );
  }
};

/**
 * Fetch repository og:image.
 * @param {string} repo
 * @param {*} packageName
 */
const _fetchOGImage = async function(pkg, packageName) {
  // Helper method to fetch og:image.
  const _fetchOGImageForRepo = async function(repo) {
    try {
      const url = urljoin("https://github.com/", repo);
      const resp = await AxiosService.create().get(url);
      const text = resp.data;
      const $ = cheerio.load(text);
      let ogImageUrl = $("meta[property='og:image']").attr("content");
      if (/^https:\/\/avatar/.test(ogImageUrl)) {
        ogImageUrl = "";
      }
      return ogImageUrl;
    } catch (error) {
      if (!isErrorCode(error, 404)) {
        logger.error(
          httpErrorInfo(error, { pkg: packageName }),
          "fetch og:Image error"
        );
      }
      return "";
    }
  };
  // Fetch from repo.
  let imageUrl = await _fetchOGImageForRepo(pkg.repo);
  // Fetch from parent repo.
  if (!imageUrl && pkg.parentRepo) {
    imageUrl = await _fetchOGImageForRepo(pkg.parentRepo);
  }
  // Save it.
  try {
    await PackageExtra.setImageUrl(packageName, imageUrl);
  } catch (error) {
    logger.error(
      httpErrorInfo(error, { pkg: packageName }),
      "save og:Image error"
    );
  }
};

/**
 * Fetch repository readme.
 * @param {string} repo
 */
const _fetchReadme = async function(pkg, packageName) {
  try {
    const [branch, path] = pkg.readme.split(":");
    const resp = await AxiosService.create().get(
      urljoin("https://github.com/", pkg.repo, "raw", branch, path)
    );
    const text = resp.data;
    await PackageExtra.setReadme(packageName, text);
    const html = await renderMarkdownToHtml({ pkg, markdown: text });
    await PackageExtra.setReadmeHtml(packageName, html);
  } catch (error) {
    logger.error(
      httpErrorInfo(error, { pkg: packageName }),
      "fetch readme error"
    );
  }
};

/**
 * Aggregate extra data for all packages into redis.
 */
const aggregateExtraData = async function() {
  logger.info("aggregateExtraData");
  const packageNames = await loadPackageNames();
  const aggData = {};
  for (let packageName of packageNames) {
    // Verify package
    if (!packageExists(packageName)) {
      logger.error({ pkg: packageName }, "package doesn't exist");
      continue;
    }
    const data = {};
    const stars = await PackageExtra.getStars(packageName);
    data.stars = stars || 0;
    const pstars = await PackageExtra.getParentStars(packageName);
    data.pstars = pstars || undefined;
    const unity = await PackageExtra.getUnityVersion(packageName);
    data.unity = unity || "2018.1";
    const imageUrl = await PackageExtra.getImageUrl(packageName);
    data.imageUrl = imageUrl || undefined;
    const updatedTime = await PackageExtra.getUpdatedTime(packageName);
    data.time = updatedTime || undefined;
    const version = await PackageExtra.getVersion(packageName);
    data.ver = version || undefined;
    aggData[packageName] = data;
  }
  await PackageExtra.setAggregatedExtraData(aggData);
};

/**
 * Update feeds.
 */
const updateFeeds = async function() {
  logger.info("updateFeeds");
  const packageNames = await loadPackageNames();
  const objs = [];
  for (let packageName of packageNames) {
    // Verify package
    if (!packageExists(packageName)) {
      logger.error({ pkg: packageName }, "package doesn't exist");
      continue;
    }
    const pkg = await loadPackage(packageName);
    const image = (await PackageExtra.getImageUrl(packageName)) || pkg.image;
    const time = await PackageExtra.getUpdatedTime(packageName);
    const version = await PackageExtra.getVersion(packageName);
    const author = [
      {
        name: pkg.owner,
        link: pkg.ownerUrl
      }
    ];
    if (pkg.parentRepoUrl) {
      author.push({
        name: pkg.parentOwner,
        link: pkg.parentOwnerUrl
      });
    }
    if (time && version)
      objs.push({
        packageName,
        displayName: pkg.displayName || packageName,
        image,
        time,
        version,
        author
      });
  }
  await PackageFeed.setFeedRecentUpdate(objs);
};

if (require.main === module) {
  let program = require("../utils/commander");
  let packageNames = null;
  program
    .option("--all", "fetch extra package data for all packages")
    .arguments("[name...]")
    .action(function(names) {
      packageNames = names;
    })
    .parse(process.argv)
    .run(async function() {
      if (program.all) packageNames = await loadPackageNames();
      if (packageNames === null || !packageNames.length) program.help();
      await fetchExtraData(packageNames);
      await aggregateExtraData();
      await updateFeeds();
    });
}
