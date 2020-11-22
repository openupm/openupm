/**
 * Update recent packages
 **/

const config = require("config");
const { orderBy } = require("lodash/collection");

const PackageExtra = require("../models/packageExtra");
const {
  loadPackageNames,
  loadPackage,
  packageExists
} = require("../utils/package");
const { healthCheck } = require("../utils/healthCheck");
const logger = require("../utils/log")(module);

/**
 * Update recent packages
 */
const updateRecentPackages = async function() {
  logger.info("updateRecentPackages");
  const packageNames = await loadPackageNames();
  const aggData = await PackageExtra.getAggregatedExtraData();
  let objs = [];
  for (let packageName of packageNames) {
    // Verify package
    if (!packageExists(packageName)) {
      logger.error({ pkg: packageName }, "package doesn't exist");
      continue;
    }
    const pkg = await loadPackage(packageName);
    const extra = aggData[pkg.name] || {};
    const result = joinPackageExtra(pkg, extra);
    if (!result.pending) objs.push(result);
  }
  objs = orderBy(objs, ["updatedAt"], ["desc"]);
  objs = objs.slice(0, 6);
  await PackageExtra.setRecentPackages(objs);
};

// Join package with extra data.
const joinPackageExtra = function(pkg, extra) {
  if (!extra) {
    extra = {};
  }
  const result = {
    ...pkg,
    ...extra
  };
  result.createdAt = result.createdAt || 0;
  result.updatedAt = result.time || 0;
  result.image = undefined;
  result.imageFilename = result.imageFilename || undefined;
  result.version = result.ver || undefined;
  result.pending = !result.version;
  result.link = {
    text: pkg.displayName || pkg.name,
    link: `/packages/${pkg.name}/`
  };
  return result;
};

if (require.main === module) {
  let program = require("../utils/commander");
  program.parse(process.argv).run(async function() {
    await updateRecentPackages();
    await healthCheck(config.healthCheck.ids.updateRecentPackages);
  });
}
