// Fetch package extra data

const axios = require("axios");
const urljoin = require("url-join");
const packageExtra = require("../models/packageExtra");
const {
  loadPackageNames,
  loadPackage,
  packageExists
} = require("../utils/package");
const logger = require("../utils/log")(module);

const fetchExtraData = async function(packageNames) {
  logger.info("fetchExtraData");
  if (!packageNames) packageNames = [];
  for (let name of packageNames) {
    // Verify package
    if (!packageExists(name)) {
      logger.error({ pkg: name }, "package doesn't exist");
      continue;
    }
    // Load package
    const pkg = await loadPackage(name);
    const data = {};
    // Fetch Unity version
    try {
      const resp = await axios.get(
        urljoin("https://package.openupm.com", name),
        {
          headers: { Accept: "application/json" }
        }
      );
      const pkgInfo = resp.data;
      const version = pkgInfo["dist-tags"].latest;
      const versionInfo = pkgInfo.versions[version];
      data.unity = versionInfo.unity;
      if (data.unity) await packageExtra.setUnityVersion(name, data.unity);
    } catch (error) {
      const is404 = error.response && error.response.status == 404;
      if (!is404) logger.error(error);
    }
    // Fetch stars
    try {
      const resp = await axios.get(
        urljoin("https://api.github.com/repos/", pkg.repo),
        {
          headers: { Accept: "application/vnd.github.v3.json" }
        }
      );
      const repoInfo = resp.data;
      let stars = 0;
      stars += repoInfo.stargazers_count || 0;
      stars += (repoInfo.parent && repoInfo.parent.stargazers_count) || 0;
      data.stars = stars;
      await packageExtra.setStars(name, data.stars);
    } catch (error) {
      console.error(error);
    }
  }
};

const updateAllPackagesExtra = async function() {
  logger.info("updateAllPackagesExtra");
  const packageNames = await loadPackageNames();
  const allPackagesExtra = {};
  for (let name of packageNames) {
    // Verify package
    if (!packageExists(name)) {
      logger.error({ pkg: name }, "package doesn't exist");
      continue;
    }
    const data = {};
    const stars = await packageExtra.getStars(name);
    data.stars = stars || 0;
    const unity = await packageExtra.getUnityVersion(name);
    data.unity = unity || "2018.2";
    allPackagesExtra[name] = data;
  }
  await packageExtra.setAllPackagesExtra(allPackagesExtra);
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
      await updateAllPackagesExtra();
    });
}
