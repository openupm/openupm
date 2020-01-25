// Util

const $ = require("jquery");
const marked = require("marked");
const urljoin = require("url-join");
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

const httpRe = /^https?:\/\//i;

const _urlUtils = {
  // OpenUPM API URL
  openupmApiUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3600"
      : "https://api.openupm.com",

  get openupmPackagesApiUrl() {
    return urljoin(_urlUtils.openupmApiUrl, "/packages/");
  },

  // GitHub repository API URL
  githubReposApiUrl: "https://api.github.com/repos/",

  // GitHub search code API URL
  githubSearchCodeApiUrl: "https://api.github.com/search/code",

  // Return Azure web build URL by buildId
  getAzureWebBuildUrl: function(buildId) {
    return (
      "https://dev.azure.com/openupm/openupm/_build/results?view=logs&buildId=" +
      buildId
    );
  },

  // Convert GitHub html URL to raw URL
  getGitHubRawUrl: function(url) {
    url = url
      .replace(
        /https?:\/\/github\.com\//i,
        "https://raw.githubusercontent.com/"
      )
      .replace(/\/blob\//, "/");
    return url;
  },

  // OpenUPM-CLI repository URL
  openupmCliRepoUrl: "https://github.com/openupm/openupm-cli#openupm-cli",

  // OpenUPM repository URL
  openupmRepoUrl: "https://github.com/openupm/openupm"
};

const _markedUtils = {
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
        href = _urlUtils.getGitHubRawUrl(href);
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

const _timeUtils = {
  // Return time since string for the given date
  timeAgoFormat: function(date) {
    return timeAgo.format(date);
  }
};

export default {
  ..._urlUtils,
  ..._markedUtils,
  ..._timeUtils
};
