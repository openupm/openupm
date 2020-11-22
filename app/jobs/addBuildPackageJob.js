// Add build package job(s).

const config = require("config");
const { queues, addJob } = require("../queues/core");
const { loadPackageNames, packageExists } = require("../utils/package");
const { healthCheck } = require("../utils/healthCheck");
const logger = require("../utils/log")(module);

// Add build package jobs for given package names.
// If no package names provided, all packages under package folder are added.
const addBuildPackagerJobs = async function(packageNames) {
  if (!packageNames) packageNames = [];
  let queue = queues.main.emitter;
  for (let name of packageNames) {
    // Verify package.
    if (!packageExists(name)) {
      logger.error({ pkg: name }, "package doesn't exist");
      continue;
    }
    let jobId = config.jobs.buildPackage.key + ":" + name;
    let job = await queue.getJob(jobId);
    // // Clean complete failed job to continue.
    // if (queue.isJobFailedCompletely(job)) {
    //   const jobId = job.id;
    //   await queue.removeJob(jobId);
    //   logger.info({ pkg: name, jobId }, "removed job failed completely");
    //   job = null;
    // }
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
    .option("--all", "add jobs for all packages")
    .arguments("[name...]")
    .action(function(names) {
      packageNames = names;
    })
    .parse(process.argv)
    .run(async function() {
      if (program.all)
        packageNames = await loadPackageNames({ sortBy: "-mtime" });
      if (packageNames === null || !packageNames.length) program.help();
      await addBuildPackagerJobs(packageNames);
      await healthCheck(config.healthCheck.ids.addBuildPackageJob);
    });
}
