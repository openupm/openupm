// Remove package release

const config = require("config");
const { queues } = require("../queues/core");
const Release = require("../models/release");
const logger = require("../utils/log")(module);

// Remove release for given packageName and version.
let removeRelease = async function(packageName, version) {
  // Remove release record
  await Release.remove({ packageName, version });
  logger.info(
    { rel: `${packageName}@${version}`, pkg: packageName },
    "removed release record"
  );
  // Remove release job
  let queue = queues.main.emitter;
  let jobId = config.jobs.buildRelease.key + ":" + packageName + ":" + version;
  await queue.removeJob(jobId);
  logger.info(
    { rel: `${packageName}@${version}`, pkg: packageName },
    "removed release job"
  );
};

module.exports = { removeRelease };

if (require.main === module) {
  let program = require("../utils/commander");
  let packageNameVal = null;
  let versionVal = null;
  program
    .arguments("<packageName> <version>")
    .action(function(packageName, version) {
      packageNameVal = packageName;
      versionVal = version;
    })
    .parse(process.argv)
    .run(removeRelease, packageNameVal, versionVal);
}
