// Job queue process.

const config = require("config");
const Timeout  = require('await-timeout');

const { hasQueue, getWorker } = require("./core");
const { buildPackage } = require("../jobs/buildPackage");
const { buildRelease } = require("../jobs/buildRelease");
const logger = require("../utils/log")(module);

// Process job
const processJob = async function (job) {
  if (job.name == config.jobs.buildPackage.name) {
    await buildPackage(job.data.name);
  } else if (job.name == config.jobs.buildRelease.name) {
    await buildRelease(job.data.name, job.data.version);
  } else {
    // Log and mute the unknown job name
    logger.error(
      { jobId: job.id, name: job.name },
      "unknown job name"
    );
  }
}

// Handle job, timeout and exception
const jobHandler = async function (job) {
  logger.info({ jobId: job.id }, "job start");
  const timer = new Timeout();
  try {
    const timeout = job.opts.timeout || 60000;
    await Promise.race([
      processJob(job),
      timer.set(timeout, 'Timeout')
    ]);
  } catch (err) {
    logger.error({ jobId: job.id, name: job.name, err }, "job failed with error");
    throw err;
  } finally {
    timer.clear();
  }
};

// Dispatch job to worker
const dispatch = async function (queueName) {
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
  return worker.run();
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
    .requiredArgs(1)
    .run(async function () {
      await dispatch(_queueName);
    })
}
