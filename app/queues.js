// Queues

const config = require('config');
const Queue = require('bee-queue');
const addLazyProperty = require("lazy-property")

const queues = {};

const queueWrap = function (queueName, configName) {
  return function () {
    return new Queue(queueName, config.queues[configName]);
  };
}

addLazyProperty(queues, 'emitter', queueWrap('build', 'emitter'));
addLazyProperty(queues, 'worker', queueWrap('build', 'worker'));

module.exports = queues;
