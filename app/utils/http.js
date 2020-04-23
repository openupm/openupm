// HTTP utils.

const axios = require("axios");
const tunnel = require("tunnel");
const url = require("url");
const urljoin = require("url-join");

// The axios service supports http agent.
const AxiosService = {
  create() {
    if (!process.env.http_proxy) {
      return axios;
    }
    const proxy = url.parse(process.env.http_proxy);
    const proxyHost = urljoin(proxy.protocol, proxy.hostname);
    const proxyPort = proxy.port;
    const agent = tunnel.httpsOverHttp({
      proxy: {
        host: proxyHost,
        port: proxyPort
      }
    });
    return axios.create({
      agent,
      proxy: false
    });
  }
};

module.exports = { AxiosService };
