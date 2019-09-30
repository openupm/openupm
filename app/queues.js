// Queues

const config = require("config");
const Queue = require("bee-queue");
const addLazyProperty = require("lazy-property");

// Store all queues.
const queues = {};

// Queue wrapper method.
const queueWrap = function(queueName, configName) {
  return function() {
    let queue = new Queue(queueName, config.queues[configName]);
    // Return true if job failed with no more retries.
    queue.isJobFailedCompletely = function(job) {
      return job && job.status == "failed" && job.options.retries <= 0;
    };
    return queue;
  };
};

// The queue to serve short web process jobs on demand.
queues.web = {};
addLazyProperty(queues.web, "emitter", queueWrap("web", "emitter"));
addLazyProperty(queues.web, "worker", queueWrap("web", "worker"));

// The queue to serve regular scheduled background jobs.
queues.background = {};
addLazyProperty(queues.background, "emitter", queueWrap("bg", "emitter"));
addLazyProperty(queues.background, "worker", queueWrap("bg", "worker"));

module.exports = queues;
