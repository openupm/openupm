// Job queue process.

const config = require("config");

const { hasQueue, getWorker } = require("./core");
const { buildPackage } = require("../jobs/buildPackage");
const { buildRelease } = require("../jobs/buildRelease");
const logger = require("../utils/log")(module);

var dispatch = function (queueName) {
  const jobHandler = async function (job) {
    logger.info({ jobId: job.id }, "job start");
    try {
      if (job.name == config.jobs.buildPackage.name) {
        await buildPackage(job.data.name);
      } else if (job.name == config.jobs.buildRelease.name) {
        await buildRelease(job.data.name, job.data.version);
      } else {
        logger.error(
          { jobId: job.id, name: job.name },
          "unknown job name"
        );
      }
    } catch (err) {
      logger.error({ jobId: job.id, name: job.name, err }, "job failed with error");
      throw err;
    }
  };
  const worker = getWorker(queueName, jobHandler);
  worker.on("completed", job => {
    logger.info({ jobId: job.id }, "job completed");
  });
  worker.on("failed", job => {
    logger.info({ jobId: job.id }, "job failed");
  });
  worker.on('drained', () => {
    logger.info("queue drained");
  });
  worker.run();
};

if (require.main === module) {
  let program = require("../utils/commander");
  let _queueName = null;
  program
    .arguments("<queue>")
    .action(function (queueName) {
      if (!hasQueue(queueName))
        throw new Error(`Can not recognize settings for queue name=${queueName}.`);
      _queueName = queueName;
    })
    .parse(process.argv)
    .requiredArgs(1);
  dispatch(_queueName);
}
