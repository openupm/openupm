// Queue core.

const config = require("config");
const { Queue, Worker } = require('bullmq');
const logger = require("../utils/log")(module);

// Cache queue preset instances.
const queues = {};

// Get a preset queue
const getQueue = function (name) {
  if (queues[name] === undefined) {
    const settings = { ...config.queueSettings[name], connection: config.redis };
    const queue = new Queue(name, settings);
    queues[name] = queue;
  }
  return queues[name];
}

// Has a queue preset
const hasQueue = function (name) {
  return config.queueSettings[name] !== undefined;
}

// Get a preset worker
const getWorker = function (name, jobHandler) {
  const settings = { ...config.queueSettings[name], connection: config.redis, autorun: false };
  const worker = new Worker(name, jobHandler, settings);
  return worker;
}

// Add job
const addJob = async function ({ queue, name, data, opts }) {
  if (data === undefined) data = {};
  if (opts == undefined) opts = {};
  // Check duplication
  if (opts.jobId) {
    let job = await queue.getJob(opts.jobId);
    if (job) return null;
  }
  // Add job
  const job = await queue.add(name, data, opts);
  logger.info({ jobId: job.id, name, data, opts }, "new job");
  return job;
};

module.exports = {
  hasQueue,
  getQueue,
  getWorker,
  addJob
};
