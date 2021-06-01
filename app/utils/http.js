// HTTP utils.

const axios = require("axios");
const CancelToken = axios.CancelToken;
const tunnel = require("tunnel");
const url = require("url");
const urljoin = require("url-join");

// The axios service supports http agent.
const AxiosService = {
  create() {
    const config = { timeout: 10000 };
    // Handle proxy
    if (process.env.http_proxy) {
      const proxyAddr = url.parse(process.env.http_proxy);
      const proxy = {
        host: urljoin(proxyAddr.protocol, proxyAddr.hostname),
        port: proxyAddr.port
      };
      const agent = tunnel.httpsOverHttp({
        proxy
      });
      config.agent = agent;
      config.proxy = false;
    }
    return axios.create(config);
  }
};

/**
 * Return HTTP error info object
 * @param {Object} error
 * @param {Object} others
 */
const httpErrorInfo = function(err, others) {
  // Show http status if possible or fallback to error
  if (err.response && err.response.status)
    return { status: err.response.status, ...others };
  else return { err, ...others };
};

/**
 * Return if error has given status code.
 * @param {Object} error
 * @param {Number} code
 */
const isErrorCode = function(error, code) {
  return error.response && error.response.status == code;
};

module.exports = { AxiosService, CancelToken, httpErrorInfo, isErrorCode };
