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
    const proxyAddr = url.parse(process.env.http_proxy);
    const proxy = {
      host: urljoin(proxyAddr.protocol, proxyAddr.hostname),
      port: proxyAddr.port
    };
    const agent = tunnel.httpsOverHttp({
      proxy
    });
    return axios.create({
      agent,
      proxy: false
    });
  }
};

module.exports = { AxiosService };
