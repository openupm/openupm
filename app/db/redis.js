const config = require('config');
const redis = require('promise-redis')();
const logger = require('../utils/log')(module);

var client = redis.createClient(config.redisUrl);
client.on('connect', function () {
  logger.info('connected to server');
});
client.on('error', function (err) {
  logger.error(err);
});
client.on('reconnecting', function (context) {
  var delay = context.delay;
  var attempt = context.attempt;
  var message = `reconnecting in ${delay}ms, attempt #${attempt}`;
  logger.info(message);
});
client.on('end', function () {
  logger.info('end');
});

module.exports = client;
