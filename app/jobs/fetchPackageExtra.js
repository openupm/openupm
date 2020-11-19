/**
 * Fetch package extra data
 **/
const _ = require("lodash");
const fs = require("fs");
const path = require("path");

const config = require("config");
const urljoin = require("url-join");
const sharp = require("sharp");

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
const s3 = require("../utils/s3");
const logger = require("../utils/log")(module);

// Paths.
const dataDir = path.resolve(__dirname, "../../data");
const mediaDir = path.resolve(dataDir, "media");

/**
 * Fetch package extra data into redis for given packageNames array.
 * @param {Array} packageNames
 * @param {Boolean} force
 */
const fetchExtraData = async function(packageNames, force) {
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
    await _cacheImage(pkg, packageName, force);
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
 * @param {object} repo
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
 * @param {object} repo
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
 * @param {object} repo
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
 * @param {object} repo
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
  try {
    // Fetch from repo.
    let imageUrl = await _fetchOGImageForRepo(pkg.repo);
    // Fetch from parent repo.
    if (!imageUrl && pkg.parentRepo) {
      imageUrl = await _fetchOGImageForRepo(pkg.parentRepo);
    }
    // Save it.
    await PackageExtra.setImageUrl(packageName, imageUrl);
  } catch (error) {
    logger.error(
      httpErrorInfo(error, { pkg: packageName }),
      "_fetchOGImage error"
    );
  }
};

/**
 * Cache the image url
 * @param {object} pkg
 * @param {string} packageName
 * @param {Boolean} force
 */
const _cacheImage = async function(pkg, packageName, force) {
  logger.info({ pkg: packageName }, "_cacheImage");
  try {
    // get the image url
    let imageUrl = await PackageExtra.getImageUrl(packageName);
    if (!imageUrl) imageUrl = pkg.image;
    const oldCachedImageFilename = await PackageExtra.getCachedImageFilename(
      packageName
    );
    // return if imageUrl is null
    if (!imageUrl) {
      await PackageExtra.setCachedImageUrl(packageName, null, null, 0);
      await _cacheImageRemoveFile(
        packageName,
        oldCachedImageFilename,
        "old cache"
      );
      logger.info({ pkg: packageName }, "_cacheImage skip for empty imageUrl");
      return;
    }
    // check image cache
    const cachedImageOriginalUrl = await PackageExtra.getCachedImageOriginalUrl(
      packageName
    );
    const cacheImageTime = await PackageExtra.getCachedImageTime(packageName);
    const now = new Date().getTime();
    if (
      !force &&
      cachedImageOriginalUrl == imageUrl &&
      now - cacheImageTime < config.packageExtra.image.cacheDuration
    ) {
      logger.info({ pkg: packageName }, "_cacheImage hit cache: time valid");
      return;
    }
    // download image to a tmp file
    const tmpFilename = `${packageName}-${now}.tmp`;
    const tmpFilePath = path.join(mediaDir, tmpFilename);
    try {
      await _cacheImageDownloadUrl(packageName, imageUrl, tmpFilePath);
    } catch (error) {
      logger.error(
        httpErrorInfo(error, { pkg: packageName, imageUrl }),
        "_cacheImage failed to download the image url "
      );
      return;
    }
    // check cached image size
    const stats = fs.statSync(tmpFilePath);
    const fileSize = stats.size;
    const cachedImageOriginalSize = await PackageExtra.getCachedImageOriginalSize(
      packageName
    );
    if (
      !force &&
      cachedImageOriginalUrl == imageUrl &&
      fileSize == cachedImageOriginalSize
    ) {
      logger.info({ pkg: packageName }, "_cacheImage hit cache: same size");
      await _cacheImageRemoveFile(packageName, tmpFilename, "tmp file");
      return;
    }
    // process the image
    const width = config.packageExtra.image.width;
    const height = config.packageExtra.image.height;
    const processedFilename = `${packageName}-${width}x${height}-${now}.png`;
    const processedFilepath = path.join(mediaDir, processedFilename);
    try {
      const fit = pkg.imageFit == "contain" ? "contain" : "cover";
      await _cacheImageProcessImage(
        packageName,
        fit,
        tmpFilePath,
        processedFilename,
        processedFilepath
      );
      await _cacheImageRemoveFile(packageName, tmpFilename, "tmp file");
    } catch (error) {
      logger.error(
        httpErrorInfo(error, { imageUrl }),
        "_cacheImage failed to processe image url"
      );
      return;
    }
    // save the cached image url
    await PackageExtra.setCachedImageUrl(
      packageName,
      processedFilename,
      imageUrl,
      fileSize
    );
    await _cacheImageRemoveFile(
      packageName,
      oldCachedImageFilename,
      "old cache"
    );
  } catch (error) {
    logger.error(
      httpErrorInfo(error, { pkg: packageName }),
      "_cacheImage error"
    );
    return;
  }
};

/**
 * Download the given image url.
 * @param {string} imageUrl
 * @param {string} destPath
 */
const _cacheImageDownloadUrl = async function(packageName, imageUrl, destPath) {
  let resp = null;
  const source = CancelToken.source();
  setTimeout(() => {
    if (resp === null) source.cancel("ECONNTIMEOUT");
  }, 10000);
  const headers = {};
  if (config.gitHub.token)
    headers.authorization = `Bearer ${config.gitHub.token}`;
  resp = await AxiosService.create().get(imageUrl, {
    headers,
    cancelToken: source.token,
    responseType: "stream"
  });
  const readStream = resp.data;
  const writeStream = fs.createWriteStream(destPath);
  readStream.pipe(writeStream);
  const streamEnd = new Promise(function(resolve, reject) {
    writeStream.on("close", () => resolve(null));
    readStream.on("error", reject);
  });
  await streamEnd;
  logger.info({ pkg: packageName, destPath }, "_cacheImage image downloaded");
};

/**
 * Process the given image.
 * @param {string} imageUrl
 * @param {string} destPath
 */
const _cacheImageProcessImage = async function(
  packageName,
  fit,
  sourcePath,
  destFilename,
  destPath
) {
  const image = sharp(sourcePath);
  await image
    .resize(600, 300, {
      fit,
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png()
    .toFile(destPath);
  // copy to s3
  await s3.uploadFile({
    bucket: config.s3.mediaBucket,
    localPath: destPath,
    remotePath: `media/${destFilename}`,
    acl: "public-read",
    contentType: "image/png"
  });
  logger.info(
    { pkg: packageName, destPath, fit },
    "_cacheImage image processed"
  );
};

/**
 * Remove the given filename from the local media folder and the s3 media bucket
 * @param {string} packageName
 * @param {string} filename
 * @param {string} reason
 */
const _cacheImageRemoveFile = async function(packageName, filename, reason) {
  if (!filename) return;
  const localFilePath = path.join(mediaDir, filename);
  // remove from local
  try {
    fs.unlinkSync(localFilePath);
  } catch (error) {
    logger.warn(
      httpErrorInfo(error, { packageName, localFilePath }),
      `_cacheImage failed to remove local ${reason}`
    );
  }
  // remove from s3
  const s3FilePath = _cacheImageGetS3Path(filename);
  try {
    await s3.removeFile({
      bucket: config.s3.mediaBucket,
      remotePath: s3FilePath
    });
  } catch (error) {
    logger.warn(
      httpErrorInfo(error, { packageName, s3FilePath }),
      `_cacheImage failed to remove s3 ${reason}`
    );
  }
};

const _cacheImageGetS3Path = function(filename) {
  return `media/${filename}`;
};

/**
 * Fetch repository readme.
 * @param {object} repo
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
    .option("-f, --force", "ignore cache and force to fetch stuffs")
    .arguments("[name...]")
    .action(function(names) {
      packageNames = names;
    })
    .parse(process.argv)
    .run(async function() {
      if (program.all)
        packageNames = await loadPackageNames({ sortBy: "-mtime" });
      if (packageNames === null || !packageNames.length) program.help();
      await fetchExtraData(packageNames, program.force);
    });
}
