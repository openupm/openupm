const config = require("config");
const Redis = require("ioredis");
const logger = require("../utils/log")(module);

const _redis = {
  _client: null,
  get client() {
    if (this._client == null) {
      const client = new Redis(config.redis);
      client.on("connect", function() {
        logger.info("redis: connected to server");
      });
      client.on("ready", function() {
        logger.info("redis: ready to use");
      });
      client.on("error", function(err) {
        logger.error({err}, "redis: error");
      });
      client.on("reconnecting", function(delay) {
        const message = `redis: reconnecting in ${delay}ms`;
        logger.info(message);
      });
      client.on("end", function() {
        logger.info("redis: end");
      });
      client.on("close", function() {
        logger.info("redis: connection lost");
      });
      this._client = client;
    }
    return this._client;
  },
  close() {
    if (this._client === null) return;
    this._client.quit();
    this._client = null;
  }
};

module.exports = _redis;
