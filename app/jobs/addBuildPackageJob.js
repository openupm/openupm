// Add build package job(s).

const config = require("config");
const { getQueue, addJob } = require("../queues/core");
const { loadPackageNames, packageExists } = require("../utils/package");
const { healthCheck } = require("../utils/healthCheck");
const logger = require("../utils/log")(module);

// Add build package jobs for given package names.
// If no package names provided, all packages under package folder are added.
const addBuildPackagerJobs = async function(packageNames) {
  if (!packageNames) packageNames = [];
  const jobConfig = config.jobs.buildPackage;
  const queue = getQueue(jobConfig.queue);
  for (const name of packageNames) {
    // Verify package.
    if (!packageExists(name)) {
      logger.error({ pkg: name }, "package doesn't exist");
      continue;
    }
    // Add job
    const jobId = jobConfig.name + ":" + name;
    job = await addJob({
      queue,
      name: jobConfig.name,
      data: { name },
      opts: { jobId }
    });
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
        packageNames = await loadPackageNames({ sortKey: "-mtime" });
      if (packageNames === null || !packageNames.length) program.help();
      await addBuildPackagerJobs(packageNames);
      await healthCheck(config.healthCheck.ids.addBuildPackageJob);
    });
}
