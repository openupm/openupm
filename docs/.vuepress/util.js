// Util

const formatDistanceToNow = require("date-fns/formatDistanceToNow").default;
var dateFnsEnLocale = require("date-fns/locale/en-US").default;
var dateFnsZhLocale = require("date-fns/locale/zh-CN").default;

const { isDate } = require("lodash/lang");
const urljoin = require("url-join");

const { getCachedAvatarImageFilename } = require("@root/app/common/utils");

const BASE_DOMAIN = process.env.BASE_DOMAIN;
const OPENUPM_REGION = process.env.OPENUPM_REGION == "cn" ? "cn" : "us";

const _urlUtils = {
  // OpenUPM API URL
  openupmApiUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3600"
      : `https://api.${BASE_DOMAIN}`,

  // OpenUPM registry URL
  openupmRegistryUrl: `https://package.${BASE_DOMAIN}`,

  get openupmPackagesApiUrl() {
    return urljoin(_urlUtils.openupmApiUrl, "/packages/");
  },

  // GitHub repository API URL
  githubReposApiUrl: "https://api.github.com/repos/",

  // GitHub search code API URL
  githubSearchCodeApiUrl: "https://api.github.com/search/code",

  // Package installer Site URL
  packageInstallerSiteUrl:
    OPENUPM_REGION == "cn"
      ? `https://installer.${BASE_DOMAIN}`
      : "https://package-installer.glitch.me",

  // Unity registry URL
  unityRegistryUrl: OPENUPM_REGION == "cn"
    ? "https://packages.unity.cn"
    : "https://packages.unity.com",

  // Avatar URL
  getAvatarImageUrl: function(username, size) {
    const mediaBaseUrl = _urlUtils.getMediaBaseUrl();
    const filename = getCachedAvatarImageFilename(username, size);
    return urljoin(mediaBaseUrl, filename);
  },

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

  // Return docs URL for the given language
  getDocsUrl: function(url, lang) {
    if (!lang && OPENUPM_REGION == "cn") lang = "zh";
    return lang ? `/${lang}${url}` : url;
  },

  getMediaBaseUrl: function() {
    return OPENUPM_REGION == "cn"
      ? "https://openupm.s3.cn-south-1.jdcloud-oss.com/media/"
      : "https://openupm.sfo2.cdn.digitaloceanspaces.com/media/";
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
  openupmRepoUrl: "https://github.com/openupm/openupm",

  // Tweet URL
  tweetUrl:
    "https://twitter.com/intent/tweet?text=Get%20600%2B%20open-source%20Unity%20packages%20from%20the%20OpenUPM%20registry&url=https://openupm.com&via=openupmupdate&hashtags=unity3d,openupm,upm,gamedev",

  // Weibo URL
  weiboUrl: "https://service.weibo.com/share/share.php?url=https://openupm.cn"
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
    try {
      if (!isDate(date)) date = new Date(date);
      return formatDistanceToNow(date, {
        locale: OPENUPM_REGION == "cn" ? dateFnsZhLocale : dateFnsEnLocale
      });
    } catch (err) {
      return "";
    }
  }
};

const _packageUtils = {
  // Covnert the package cached image filename to the full URL.
  getPackageImageUrl(imageFilename) {
    if (!imageFilename) return null;
    const mediaBaseUrl = _urlUtils.getMediaBaseUrl();
    return urljoin(mediaBaseUrl, imageFilename);
  },

  // Join package with extra data.
  joinPackageExtra(pkg, extra) {
    if (!extra) {
      extra = {};
    }
    // Join package extra information
    const result = {
      ...pkg,
      ...extra
    };
    // Prepare localized text
    if (OPENUPM_REGION == "cn") {
      if (pkg.displayName_zhCN) {
        result.displayName = pkg.displayName_zhCN;
        result.link.text = pkg.displayName_zhCN;
      }
      if (pkg.description_zhCN) result.description = pkg.description_zhCN;
    }
    // Prepare the sort name
    result.sortName = pkg.link.text;
    // Prepare the time fields
    result.createdAt = result.createdAt || 0;
    result.updatedAt = result.time || 0;
    // Override the image with the full URL
    result.image = _packageUtils.getPackageImageUrl(result.imageFilename);
    // Prepare the version field
    result.version = result.ver || undefined;
    // Prepare the pending state
    result.pending = !result.version;
    return result;
  }
};

export default {
  ..._urlUtils,
  ..._pageUtils,
  ..._timeUtils,
  ..._packageUtils
};
