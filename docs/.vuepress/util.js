// Util

const $ = require("jquery");
const marked = require("marked");
const urljoin = require("url-join");
const moment = require("moment");

const httpRe = /^https?:\/\//i;
const gitHubBlobRe = /^https?:\/\/github\.com\/.*\/.*\/blob\//i;

const _urlUtils = {
  // OpenUPM API URL
  openupmApiUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3600"
      : "https://api.openupm.com",

  // OpenUPM registry URL
  openupmRegistryUrl: "https://package.openupm.com",

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

  // Convert GitHub URL to GitHub raw URL
  convertToGitHubRawUrl: function(url) {
    if (gitHubBlobRe.test(url)) url = url.replace(/\/blob\//, "/raw/");
    return url;
  },

  // Get package URL
  getPackageUrl: function(pages, packageName) {
    const page = _pageUtils.getPackagePage(pages, packageName);
    if (page) return page.path;
    else if (packageName.startsWith("com.unity."))
      return `https://docs.unity3d.com/Packages/${packageName}@latest`;
    else return null;
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
      } else {
        href = _urlUtils.convertToGitHubRawUrl(href);
      }
      return originalRendererImage(href, title, text);
    };

    return renderer;
  },

  // Post-processing markdown html
  postMarkdown: function(html, { imageBaseUrl }) {
    const root = $(`<div>${html}</div>`);
    root.find("img").attr("src", (idx, attr) => {
      if (attr === undefined) return undefined;
      if (!httpRe.test(attr)) attr = urljoin(imageBaseUrl, attr);
      return attr;
    });
    return root.html();
  }
};

const _pageUtils = {
  // Get package page
  getPackagePage: function(pages, packageName) {
    for (const page of pages) {
      const pkg = page.frontmatter.package;
      if (pkg && pkg.name == packageName) return page;
    }
    return null;
  }
};

const _timeUtils = {
  // Return time since string for the given date
  timeAgoFormat: function(date) {
    return moment(date).fromNow();
  }
};

const _packageUtils = {
  // Join package with extra data.
  joinPackageExtra(pkg, extra) {
    if (!extra) {
      extra = {};
    }
    const result = {
      ...pkg,
      ...extra,
      sortName: pkg.link.text
    };
    result.image = extra.imageUrl || pkg.image;
    return result;
  }
};

export default {
  ..._urlUtils,
  ..._markedUtils,
  ..._pageUtils,
  ..._timeUtils,
  ..._packageUtils
};
