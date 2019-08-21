// Queue

const config = require('config');
const Queue = require('bee-queue');

const QueueName = {
  // The emitter queue to generate jobs (provider).
  emitter: 'emitter',
  // The worker queue to process jobs (consumer).
  worker: 'worker',
};

// Store queues for lazy initialization.
const queues = {};

// Default queue config shared by all queues.
const baseConfig = {
  redis: config.redis,
  removeOnSuccess: true,
  removeOnFailure: false,
};

// Queue configurations.
const queueConfigs = {};

queueConfigs[QueueName.emitter] = {
  ...baseConfig,
  isWorker: false,
  // The queue does not need to receive job events.
  getEvents: false,
  // The queue does not store jobs, so you can use Queue#getJob to check job status safely.
  storeJobs: false,
  // The queue is not responsible for activating delayed jobs.
  activateDelayedJobs: false,
};

queueConfigs[QueueName.worker] = {
  ...baseConfig,
  isWorker: true,
  activateDelayedJobs: true,
};

// Get queue.
const getQueue = function (queueName) {
  if (!queues[queueName])
    queues[queueName] = new Queue('build', queueConfigs[queueName]);
  return queues[queueName];
};

module.exports = {
  QueueName,
  getQueue,
};
