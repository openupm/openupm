// Util

const formatDistanceToNow = require("date-fns/formatDistanceToNow").default;
const urljoin = require("url-join");

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

  // Package installer Site URL
  packageInstallerSiteUrl: "https://package-installer.glitch.me",

  // Package installer URL
  getPackageInstallerUrl: function(packageName, scopes) {
    const params = new URLSearchParams();
    params.set("registry", this.openupmRegistryUrl);
    if (scopes) {
      for (const scope of scopes) {
        params.append("scope", scope);
      }
    }
    return urljoin(
      this.packageInstallerSiteUrl,
      "/v1/installer/OpenUPM/",
      packageName,
      "?" + params.toString()
    );
  },

  // Return Azure web build URL by buildId
  getAzureWebBuildUrl: function(buildId) {
    return (
      "https://dev.azure.com/openupm/openupm/_build/results?view=logs&buildId=" +
      buildId
    );
  },

  // Convert GitHub URL to GitHub raw URL
  convertToGitHubRawUrl: function(url) {
    const gitHubBlobRe = /^https?:\/\/github\.com\/.*\/.*\/blob\//i;
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

const _imageUtils = {
  // Handle broken image
  imageNotFound(event) {
    event.target.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=";
  }
};

export default {
  ..._urlUtils,
  ..._pageUtils,
  ..._timeUtils,
  ..._packageUtils,
  ..._imageUtils
};
