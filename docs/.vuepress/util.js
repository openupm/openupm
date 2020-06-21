// Util

const $ = require("jquery");
const formatDistanceToNow = require("date-fns/formatDistanceToNow").default;

const marked = require("marked");
const highlightjs = require("highlight.js");
const urljoin = require("url-join");

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
  markedRenderer: function({
    linkBaseUrl,
    linkBaseRelativeUrl,
    imageBaseUrl,
    imageBaseRelativeUrl
  }) {
    const renderer = new marked.Renderer();
    const originalRendererLink = renderer.link.bind(renderer);
    const originalRendererImage = renderer.image.bind(renderer);

    renderer.link = (href, title, text) => {
      if (href.startsWith("#")) {
        return `<a href='${href}'>${text}</a>`;
      }
      if (!httpRe.test(href)) {
        if (href.startsWith("/")) {
          href = urljoin(linkBaseUrl, href);
        } else {
          href = urljoin(linkBaseRelativeUrl, href);
        }
      }
      let link = originalRendererLink(href, title, text);
      link = link.replace("<a", '<a rel="noopener noreferrer"');
      return link;
    };

    renderer.image = (href, title, text) => {
      if (!httpRe.test(href)) {
        if (href.startsWith("/")) {
          href = urljoin(imageBaseUrl, href);
        } else {
          href = urljoin(imageBaseRelativeUrl, href);
        }
      } else {
        href = _urlUtils.convertToGitHubRawUrl(href);
      }
      return originalRendererImage(href, title, text);
    };

    // highlightjs: https://shuheikagawa.com/blog/2015/09/21/using-highlight-js-with-marked/
    const escapeMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    function escapeForHTML(input) {
      return input.replace(/([&<>'"])/g, char => escapeMap[char]);
    }
    renderer.code = (code, language) => {
      // Check whether the given language is valid for highlight.js.
      const validLang = !!(language && highlightjs.getLanguage(language));

      // Highlight only if the language is valid.
      // highlight.js escapes HTML in the code, but we need to escape by ourselves
      // when we don't use it.
      const highlighted = validLang
        ? highlightjs.highlight(language, code).value
        : escapeForHTML(code);

      // Render the highlighted code with `hljs` class.
      return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
    };

    return renderer;
  },

  // Post-processing markdown html
  postMarkdown: function(html, { imageBaseRelativeUrl }) {
    const root = $(`<div>${html}</div>`);
    root.find("img").attr("src", (idx, attr) => {
      if (attr === undefined) return undefined;
      if (!httpRe.test(attr)) attr = urljoin(imageBaseRelativeUrl, attr);
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
    return formatDistanceToNow(date);
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
      ...extra
    };
    result.sortName = pkg.link.text;
    result.createdAt = result.createdAt || 0;
    result.updatedAt = result.time || 0;
    result.pending = result.updatedAt == 0;
    result.image = result.imageUrl || pkg.image;
    result.version = result.ver || undefined;
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
