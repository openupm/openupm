const config = require("config");
const redis = require("promise-redis")();
const logger = require("../utils/log")(module);

let _redis = {
  _client: null,
  get client() {
    if (this._client == null) {
      let client = redis.createClient(config.redisUrl);
      client.on("connect", function() {
        logger.info("connected to server");
      });
      client.on("error", function(err) {
        logger.error(err);
      });
      client.on("reconnecting", function(context) {
        var delay = context.delay;
        var attempt = context.attempt;
        var message = `reconnecting in ${delay}ms, attempt #${attempt}`;
        logger.info(message);
      });
      client.on("end", function() {
        logger.info("end");
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
