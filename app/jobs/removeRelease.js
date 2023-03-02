// Remove package release

const config = require("config");
const { getQueue } = require("../queues/core");
const Release = require("../models/release");
const { ReleaseState } = require("../common/constant");
const logger = require("../utils/log")(module);

// Remove release for given packageName and version.
const removeRelease = async function(packageName, version) {
  // Remove release record
  await Release.remove({ packageName, version });
  logger.info(
    { rel: `${packageName}@${version}`, pkg: packageName },
    "removed release record"
  );
  // Remove release job
  const jobConfig = config.jobs.buildRelease;
  const queue = getQueue(jobConfig.queue);
  let jobId = jobConfig.name + ":" + packageName + ":" + version;
  await queue.remove(jobId);
  logger.info(
    { rel: `${packageName}@${version}`, pkg: packageName },
    "removed release job"
  );
};

// Remove releases for given packageName and state.
const removeReleasesWithState = async function(packageName, state) {
  const releases = (await Release.fetchAll(packageName)).filter(
    x => x.state == state
  );
  for (const rel of releases) await removeRelease(packageName, rel.version);
};

// Remove all releases for given packageName
const removeAllReleases = async function(packageName) {
  const releases = await Release.fetchAll(packageName);
  for (const rel of releases) await removeRelease(packageName, rel.version);
};

module.exports = { removeRelease };

if (require.main === module) {
  const program = require("../utils/commander");
  let packageNameVal = null;
  let versionVal = null;
  program
    .option("--failed", "remove failed releases")
    .option("--all", "remove all releases")
    .arguments("<packageName> [version]")
    .action(function(packageName, version) {
      packageNameVal = packageName;
      versionVal = version;
    })
    .parse(process.argv)
    .requiredArgs(1)
    .run(async function() {
      if (program.failed)
        await removeReleasesWithState(packageNameVal, ReleaseState.Failed);
      else if (program.all) await removeAllReleases(packageNameVal);
      else if (versionVal) await removeRelease(packageNameVal, versionVal);
      else {
        program.outputHelp();
        process.exit(1);
      }
    });
}
