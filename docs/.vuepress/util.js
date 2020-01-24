// Util

const $ = require("jquery");
const marked = require("marked");
const urljoin = require("url-join");
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

const httpRe = /^https?:\/\//i;

const _urlOptions = {
  // OpenUPM API URL
  openupmApiUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3600"
      : "https://api.openupm.com",

  get openupmPackagesApiUrl() {
    return urljoin(_urlOptions.openupmApiUrl, "/packages/");
  },

  // GitHub repository API URL
  githubReposApiUrl: "https://api.github.com/repos/",

  // Return Azure web build URL by buildId
  getAzureWebBuildUrl: function(buildId) {
    return (
      "https://dev.azure.com/openupm/openupm/_build/results?view=logs&buildId=" +
      buildId
    );
  },

  // OpenUPM-CLI repository URL
  openupmCliRepoUrl: "https://github.com/openupm/openupm-cli#openupm-cli",

  // OpenUPM repository URL
  openupmRepoUrl: "https://github.com/openupm/openupm"
};

const _markedOptions = {
  // Get customized marked renderer.
  markedRenderer: function(option) {
    const renderer = new marked.Renderer();
    const originalRendererLink = renderer.link.bind(renderer);
    const originalRendererImage = renderer.image.bind(renderer);
    const httpBlobRe = /^https?:\/\/github\.com\/.*\/blob\//i;

    renderer.link = (href, title, text) => {
      if (option.linkBaseUrl && !httpRe.test(href)) {
        href = urljoin(option.linkBaseUrl, href);
      }
      let link = originalRendererLink(href, title, text);
      link = link.replace("<a", '<a target="_blank" rel="noopener noreferrer"');
      return link;
    };

    renderer.image = (href, title, text) => {
      if (option.imageBaseUrl && !httpRe.test(href)) {
        href = urljoin(option.imageBaseUrl, href);
      } else if (httpBlobRe.test(href)) {
        href = href.replace("/blob/", "/raw/");
      }
      return originalRendererImage(href, title, text);
    };

    return renderer;
  },

  // Post-processing markdown html
  postMarkdown: function(html, { imageBaseUrl }) {
    const root = $(`<div>${html}</div>`);
    root.find("img").attr("src", (idx, attr) => {
      if (!httpRe.test(attr)) attr = urljoin(imageBaseUrl, attr);
      return attr;
    });
    return root.html();
  }
};

const _timeOptions = {
  // Return time since string for the given date
  timeAgoFormat: function(date) {
    return timeAgo.format(date);
  }
};

export default {
  ..._urlOptions,
  ..._markedOptions,
  ..._timeOptions
};
