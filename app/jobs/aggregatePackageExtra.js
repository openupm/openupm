/**
 * Aggregate package extra data
 **/
const PackageExtra = require("../models/packageExtra");
const { loadPackageNames, packageExists } = require("../utils/package");
const logger = require("../utils/log")(module);

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
    const pushedTime = await PackageExtra.getRepoPushedTime(packageName);
    data.time = updatedTime || pushedTime || undefined;
    const version = await PackageExtra.getVersion(packageName);
    data.ver = version || undefined;
    aggData[packageName] = data;
  }
  await PackageExtra.setAggregatedExtraData(aggData);
};

if (require.main === module) {
  let program = require("../utils/commander");
  program.parse(process.argv).run(async function() {
    await aggregateExtraData();
  });
}
