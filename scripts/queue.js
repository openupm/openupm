// Queue

const config = require('config');
const Queue = require('bee-queue');

const workerQueueConfig = {
  redis: config.redis,
  removeOnSuccess: true,
};
const workerQueue = new Queue('build', workerQueueConfig);

const queueConfig = {
  ...workerQueueConfig,
  isWorker: false,
};
const queue = new Queue('build', queueConfig);

module.exports = {
  workerQueue,
  queue,
};
