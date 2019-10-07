// Add build package job(s).

const config = require("config");
const { queues, addJob } = require("../queues/core");
const { loadPackageNames } = require("../utils/package");
const logger = require("../utils/log")(module);

// Add build package jobs for given package names.
// If no package names provided, all packages under package folder are added.
const addBuildPackagerJobs = async function(packageNames) {
  if (!packageNames || !packageNames.length)
    packageNames = await loadPackageNames();
  let queue = queues.main.emitter;
  for (let name of packageNames) {
    let jobId = config.jobs.buildPackage.key + ":" + name;
    let job = await queue.getJob(jobId);
    // Clean complete failed job to continue.
    if (queue.isJobFailedCompletely(job)) {
      await queue.removeJob(job.id);
      logger.info(`[pkg=${name}] removed complete failed job ${jobId}`);
      job = null;
    }
    if (!job) {
      job = await addJob({
        jobId,
        jobConfig: config.jobs.buildPackage
      });
    }
  }
};

if (require.main === module) {
  let program = require("../utils/commander");
  let packageNames = null;
  program
    .arguments("[name...]")
    .action(function(names) {
      packageNames = names;
    })
    .parse(process.argv)
    .run(addBuildPackagerJobs, packageNames);
}
