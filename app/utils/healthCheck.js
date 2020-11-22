/**
 * Ping healthchecks.io
 */

const urljoin = require("url-join");

const { AxiosService, CancelToken, httpErrorInfo } = require("./http");
const logger = require("./log")(module);

/**
 * Ping healthchecks.io
 * @param {string} checkId
 */
const healthCheck = async function(checkId) {
  if (process.env.NODE_ENV !== "production") return;
  try {
    let resp = null;
    const source = CancelToken.source();
    setTimeout(() => {
      if (resp === null) source.cancel("ECONNTIMEOUT");
    }, 10000);
    resp = await AxiosService.create().get(
      urljoin("https://hc-ping.com/", checkId),
      { cancelToken: source.token }
    );
    return resp.data;
  } catch (error) {
    logger.error(httpErrorInfo(error, { checkId }), "healthcheck error");
  }
};

module.exports = {
  healthCheck
};
