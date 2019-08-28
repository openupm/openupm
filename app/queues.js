// Queues

const config = require('config');
const Queue = require('bee-queue');
const addLazyProperty = require("lazy-property")

const queues = {};

const queueWrap = function (queueName, configName) {
  return function () {
    let queue = new Queue(queueName, config.queues[configName]);
    // Return true if job failed with no more retries.
    queue.isJobFailedCompletely = function (job) {
      return job && job.status == 'failed' && job.options.retries <= 0;
    };
    return queue;
  };
}

addLazyProperty(queues, 'emitter', queueWrap('build', 'emitter'));
addLazyProperty(queues, 'worker', queueWrap('build', 'worker'));

module.exports = queues;
