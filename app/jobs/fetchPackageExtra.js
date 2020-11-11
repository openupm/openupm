/**
 * Fetch package extra data
 **/
const _ = require("lodash");
const config = require("config");
const urljoin = require("url-join");
const PackageExtra = require("../models/packageExtra");
const {
  createGqlClient,
  gitFileContentGql,
  openGraphImageUrlGql
} = require("../utils/githubGql");
const {
  loadPackageNames,
  loadPackage,
  packageExists
} = require("../utils/package");
const { renderMarkdownToHtml } = require("../utils/markdown");
const {
  AxiosService,
  CancelToken,
  httpErrorInfo,
  isErrorCode
} = require("../utils/http");
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
    await _fetchPackageScopes(packageName);
    await _fetchRepoInfo(pkg.repo, packageName);
    await _fetchOGImage(pkg, packageName);
    await _fetchReadme(pkg, packageName);
  }
};

/**
 * Fetch package meta json.
 * @param {string} packageName
 */
const fetchPackageMeta = async function(packageName) {
  let resp = null;
  const source = CancelToken.source();
  setTimeout(() => {
    if (resp === null) source.cancel("ECONNTIMEOUT");
  }, 10000);
  resp = await AxiosService.create().get(
    urljoin("https://package.openupm.com", packageName),
    {
      headers: { Accept: "application/json" },
      cancelToken: source.token
    }
  );
  return resp.data;
};

// Get latest version from the package meta
const getLatestVersion = function(pkgMeta) {
  if (pkgMeta["dist-tags"] && pkgMeta["dist-tags"]["latest"])
    return pkgMeta["dist-tags"]["latest"];
  else if (pkgMeta.versions)
    return Object.keys(pkgMeta.versions).find(
      key => pkgMeta.versions[key] == "latest"
    );
};

/**
 * Fetch package info from the registry.
 * @param {string} repo
 * @param {string} packageName
 */
const _fetchPackageInfo = async function(packageName) {
  logger.info({ pkg: packageName }, "_fetchPackageInfo");
  try {
    const pkgMeta = await fetchPackageMeta(packageName);
    const version = pkgMeta["dist-tags"].latest;
    const versionInfo = pkgMeta.versions[version];
    // Save the unity version.
    const unityVersion = /^[0-9]{4,4}\.[0-9]/i.test(versionInfo.unity)
      ? versionInfo.unity
      : "";
    await PackageExtra.setUnityVersion(packageName, unityVersion);
    // Save the update time.
    const timeStr = pkgMeta.time[version] || 0;
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
 * Fetch package scopes for dependencies.
 * @param {string} repo
 * @param {string} packageName
 */
const _fetchPackageScopes = async function(packageName) {
  logger.info({ pkg: packageName }, "_fetchPackageScopes");
  // a list of pending {name, version}
  const pendingList = [{ name: packageName, version: null }];
  // a list of processed {name, version}
  const processedList = [];
  // a set of package names exists on the registry
  const scopeSet = new Set();
  // cached package meta: { name: meta }
  const cachedPackageMetas = {};
  while (pendingList.length > 0) {
    const entry = pendingList.shift();
    if (processedList.find(x => _.isEqual(x, entry)) === undefined) {
      // add entry to processed list
      processedList.push(entry);
      // skip unity module
      if (/com.unity.modules/i.test(entry.name)) continue;
      // fetch package meta from the cache
      let pkgMeta = cachedPackageMetas[entry.name];
      // fetch package meta from the registry
      if (!pkgMeta) {
        try {
          pkgMeta = await fetchPackageMeta(entry.name);
          cachedPackageMetas[entry.name] = pkgMeta;
        } catch (err) {
          if (!isErrorCode(err, 404)) {
            logger.error(
              httpErrorInfo(err, { pkg: packageName }),
              "fetch package scopes error"
            );
          }
        }
      }
      // skip unexisted package
      if (!pkgMeta) continue;
      // add to the scope list
      scopeSet.add(entry.name);
      // parse the latest version
      if (!entry.version || entry.version == "latest")
        entry.version = getLatestVersion(pkgMeta);
      // fall back to latest version if version does not existed
      const versions = Object.keys(pkgMeta.versions);
      if (!versions.find(x => x == entry.version))
        entry.version = getLatestVersion(pkgMeta);
      try {
        // add dependencies to pending list
        const deps = _.toPairs(
          pkgMeta.versions[entry.version]["dependencies"]
        ).map(x => {
          return { name: x[0], version: x[1] };
        });
        deps.forEach(x => pendingList.push(x));
      } catch (err) {
        logger.error(
          httpErrorInfo(err, { pkg: packageName, dep: entry.name }),
          "fetch package scopes error"
        );
      }
    }
  }
  // Save to db.
  const scopes = Array.from(scopeSet);
  scopes.sort();
  await PackageExtra.setScopes(packageName, scopes);
};

/**
 * Fetch repository information like stars and pushed time.
 * @param {string} repo
 */
const _fetchRepoInfo = async function(repo, packageName) {
  logger.info({ pkg: packageName }, "_fetchRepoInfo");
  try {
    const headers = { Accept: "application/vnd.github.v3.json" };
    if (config.gitHub.token)
      headers.authorization = `Bearer ${config.gitHub.token}`;
    let resp = null;
    const source = CancelToken.source();
    setTimeout(() => {
      if (resp === null) source.cancel("ECONNTIMEOUT");
    }, 10000);
    resp = await AxiosService.create().get(
      urljoin("https://api.github.com/repos/", repo),
      { headers, cancelToken: source.token }
    );
    const repoInfo = resp.data;
    const stars = repoInfo.stargazers_count || 0;
    await PackageExtra.setStars(packageName, stars);
    if (repoInfo.parent) {
      const pstars = repoInfo.parent.stargazers_count || 0;
      await PackageExtra.setParentStars(packageName, pstars);
    }
    if (repoInfo.pushed_at) {
      const time = new Date(repoInfo.pushed_at).getTime();
      await PackageExtra.setRepoPushedTime(packageName, time);
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
  logger.info({ pkg: packageName }, "_fetchOGImage");
  // Helper method to fetch og:image.
  const _fetchOGImageForRepo = async function(repo) {
    try {
      const [owner, name] = repo.split("/");
      const data = await createGqlClient().request(openGraphImageUrlGql, {
        owner,
        name
      });
      if (data.repository.usesCustomOpenGraphImage)
        return data.repository.openGraphImageUrl;
      return "";
    } catch (error) {
      if (!isErrorCode(error, 404)) {
        logger.error({ err: error, pkg: packageName }, "fetch og:Image error");
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
  logger.info({ pkg: packageName }, "_fetchReadme");
  try {
    const [owner, name] = pkg.repo.split("/");
    const data = await createGqlClient().request(gitFileContentGql, {
      owner,
      name,
      tree: pkg.readme
    });
    let text = "";
    if (data.repository.tree && data.repository.tree.text)
      text = data.repository.tree.text;
    await PackageExtra.setReadme(packageName, text);
    const html = await renderMarkdownToHtml({ pkg, markdown: text });
    await PackageExtra.setReadmeHtml(packageName, html);
  } catch (error) {
    logger.error({ err: error, pkg: packageName }, "fetch readme error");
  }
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
      if (program.all)
        packageNames = await loadPackageNames({ sortBy: "-mtime" });
      if (packageNames === null || !packageNames.length) program.help();
      await fetchExtraData(packageNames);
    });
}
