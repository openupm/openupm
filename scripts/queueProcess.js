// Job queue process.

const config = require("config");

const { queues } = require("../app/queues");
const { buildPackage } = require("./jobs/buildPackage");
const { buildRelease } = require("./jobs/buildRelease");
const logger = require("../app/utils/log")(module);

var dispatch = function(queue) {
  queue.on("ready", () => {
    logger.info("queue ready.");
    queue.process(config.jobs.concurrent, async function(job) {
      logger.info(`[job=${job.id}] start`);
      let sections = job.id.split(":");
      try {
        if (sections[0] == config.jobs.buildPackage.key) {
          let packageName = sections[1];
          await buildPackage(packageName);
        } else if (sections[0] == config.jobs.buildRelease.key) {
          let releaseId = parseInt(sections[1]);
          await buildRelease(releaseId);
        } else {
          throw new Error(`unknown job type ${sections[0]}`);
        }
      } catch (err) {
        logger.error(`[job=${job.id}] failed with error: `, err);
        throw err;
      }
      logger.info(`[job=${job.id}] completed`);
    });
  });
  queue.on("error", err => {
    logger.error("queue error: ", err);
  });
  queue.checkStalledJobs(config.jobs.checkStalledJobsInterval);
};

if (require.main === module) {
  let program = require("../app/utils/commander");
  let queue = null;
  program
    .arguments("<queue>")
    .action(function(queueName) {
      let queueWrapper = queues[queueName];
      if (typeof queueWrapper == "undefined")
        throw new Error(`can not find queue name ${queueName}.`);
      queue = queueWrapper.worker;
    })
    .requiredArgs(1)
    .parse(process.argv);
  dispatch(queue);
}
