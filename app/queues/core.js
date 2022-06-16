// Queue core.

const config = require("config");
const Queue = require("bee-queue");
const addLazyProperty = require("lazy-property");
const logger = require("../utils/log")(module);

// Store all queues.
const queues = {};

// Add a queue wrapper to queues with pre-defined settings.
// To get the queue object, use queues.name.settings.
const addQueueWrapper = function(name) {
  let obj = {};
  for (let preset in config.queueSettings) {
    let settings = config.queueSettings[preset];
    settings.redis = config.redis;
    addLazyProperty(obj, preset, function() {
      let queue = new Queue(name, settings);
      // Return true if job failed with no more retries.
      queue.isJobFailedCompletely = function(job) {
        return job && job.status == "failed" && job.options.retries <= 0;
      };
      return queue;
    });
  }
  queues[name] = obj;
};

// Main queue. Jobs in the queue expected to be run longer.
addQueueWrapper("main");

// Add a job.
const addJob = async function({ jobId, payload, queue, jobConfig, delay }) {
  if (jobConfig === undefined)
    jobConfig = {
      retries: 0,
      backoff: "immediate"
    };
  if (payload === undefined) payload = {};
  if (queue === undefined) queue = queues[jobConfig.queue].emitter;
  let job = await queue
    .createJob(payload)
    .setId(jobId)
    .retries(jobConfig.retries)
    .backoff(...jobConfig.backoff)
    .delayUntil(delay || 0)
    .timeout(jobConfig.timeout || 3600)
    .save();
  if (job.id) {
    logger.info({ jobId: job.id }, "new job");
    return job;
  }
  return null;
};

module.exports = {
  queues,
  addJob
};
