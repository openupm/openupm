// Remove package release

const config = require("config");
const { queues } = require("../queues/core");
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
  let queue = queues.main.emitter;
  let jobId = config.jobs.buildRelease.key + ":" + packageName + ":" + version;
  await queue.removeJob(jobId);
  logger.info(
    { rel: `${packageName}@${version}`, pkg: packageName },
    "removed release job"
  );
};

// Remove releases for given packageName and state.
const removeReleases = async function(packageName, state) {
  let releases = (await Release.fetchAll(packageName)).filter(
    x => x.state == state
  );
  for (const rel of releases) await removeRelease(packageName, rel.version);
};

module.exports = { removeRelease };

if (require.main === module) {
  let program = require("../utils/commander");
  let packageNameVal = null;
  let versionVal = null;
  program
    .option("--failed", "remove failed releases")
    .arguments("<packageName> [version]")
    .action(function(packageName, version) {
      packageNameVal = packageName;
      versionVal = version;
    })
    .parse(process.argv)
    .requiredArgs(1)
    .run(async function() {
      if (program.failed)
        await removeReleases(packageNameVal, ReleaseState.Failed);
      else if (versionVal) await removeRelease(packageNameVal, versionVal);
      else {
        program.outputHelp();
        process.exit(1);
      }
    });
}
