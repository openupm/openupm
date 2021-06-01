// Job queue process.

const config = require("config");

const { queues } = require("./core");
const { buildPackage } = require("../jobs/buildPackage");
const { buildRelease } = require("../jobs/buildRelease");
const logger = require("../utils/log")(module);

var dispatch = function(queue) {
  queue.on("ready", () => {
    logger.info("queue ready.");
    queue.process(config.jobs.concurrent, async function(job) {
      logger.info({ jobId: job.id }, "job start");
      let sections = job.id.split(":");
      try {
        if (sections[0] == config.jobs.buildPackage.key) {
          let packageName = sections[1];
          await buildPackage(packageName);
        } else if (sections[0] == config.jobs.buildRelease.key) {
          let packageName = sections[1];
          let version = sections[2];
          await buildRelease(packageName, version);
        } else {
          logger.error(
            { jobId: job.id, jobType: sections[0] },
            "unknown job type"
          );
          throw new Error(`unknown job type ${sections[0]}`);
        }
      } catch (err) {
        logger.error({ jobId: job.id, err }, "job failed");
        throw err;
      }
      logger.info({ jobId: job.id }, "job completed");
    });
  });
  queue.on("error", err => {
    logger.error({ err }, "queue error");
  });
  queue.checkStalledJobs(config.jobs.checkStalledJobsInterval);
};

if (require.main === module) {
  let program = require("../utils/commander");
  let queue = null;
  program
    .arguments("<queue>")
    .action(function(queueName) {
      let queueWrapper = queues[queueName];
      if (typeof queueWrapper == "undefined")
        throw new Error(`can not find queue name ${queueName}.`);
      queue = queueWrapper.worker;
    })
    .parse(process.argv)
    .requiredArgs(1);
  dispatch(queue);
}
