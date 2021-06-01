/**
 * Update RSS feeds
 **/
const config = require("config");
const PackageExtra = require("../models/packageExtra");
const PackageFeed = require("../models/packageFeed");
const {
  loadPackageNames,
  loadPackage,
  packageExists
} = require("../utils/package");
const { healthCheck } = require("../utils/healthCheck");
const logger = require("../utils/log")(module);

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
    const imageFilename = await PackageExtra.getCachedImageFilename(
      packageName
    );
    const image = imageFilename
      ? "https://openupm.sfo2.cdn.digitaloceanspaces.com/media/" + imageFilename
      : undefined;
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
  program.parse(process.argv).run(async function() {
    await updateFeeds();
    await healthCheck(config.healthCheck.ids.updateFeeds);
  });
}
