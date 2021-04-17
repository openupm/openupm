const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const yaml = require("js-yaml");

const OPENUPM_REGION = process.env.OPENUPM_REGION == "cn" ? "cn" : "us";
const BASE_DOMAIN = OPENUPM_REGION == "cn" ? "openupm.cn" : "openupm.com";

const configUs = require("./regions/config-us");
const configCn = require("./regions/config-cn");
const regionConfig = OPENUPM_REGION == "cn" ? configCn : configUs;

const config = {
  head: [
    ["meta", { name: "theme-color", content: "#3068E5" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" }
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "/vendors/fontawesome-free@5.15.1/css/all.css"
      }
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "/vendors/cookieconsent@3.1.1/build/cookieconsent.min.css"
      }
    ],
    ["link", { rel: "icon", href: "/images/openupm-icon-256.png" }],
    ["link", { rel: "manifest", href: "/manifest.json" }],
    ["meta", { name: "theme-color", content: "#3068E5" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" }
    ],
    ["link", { rel: "apple-touch-icon", href: "/images/openupm-icon-256.png" }],
    [
      "link",
      {
        rel: "mask-icon",
        href: "/images/openupm-icon-mask.svg",
        color: "#3068E5"
      }
    ],
    [
      "link",
      {
        rel: "alternate",
        type: "application/rss+xml",
        href: `https://api.${BASE_DOMAIN}/feeds/updates/rss`
      }
    ],
    [
      "link",
      {
        rel: "alternate",
        type: "application/rss+atom",
        href: `https://api.${BASE_DOMAIN}/feeds/updates/atom`
      }
    ],
    [
      "link",
      {
        rel: "alternate",
        type: "application/json",
        href: `https://api.${BASE_DOMAIN}/feeds/updates/json`
      }
    ],
    [
      "meta",
      {
        name: "msapplication-TileImage",
        content: "/images/openupm-icon-256.png"
      }
    ],
    ["meta", { name: "msapplication-TileColor", content: "#000000" }],
    // Google AdSense
    [
      "script",
      { src: "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" }
    ],
    [
      "script",
      {},
      '(adsbygoogle=window.adsbygoogle||[]).push({google_ad_client:"ca-pub-7925911236569822",enable_page_level_ads:true});'
    ]
  ],
  themeConfig: {
    baseDomain: BASE_DOMAIN,
    domain: `https://${BASE_DOMAIN}`,
    region: OPENUPM_REGION,
    repo: "https://github.com/openupm/openupm",
    docsDir: "docs",
    editLinks: true,
    logo: "/images/openupm-icon-128.png",
    lastUpdated: false,
    smoothScroll: true,
    jdCloudUrl: "https://www.jdcloud.com/"
  },
  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    [
      "@vuepress/plugin-register-components",
      {
        componentsDir: path.resolve(__dirname, "./theme/components")
      }
    ],
    "@vuepress/plugin-back-to-top",
    // ["@vuepress/pwa", { serviceWorker: true, updatePopup: true }],
    "vuepress-plugin-chunkload-redirect",
    "@vuepress/plugin-medium-zoom",
    "vuepress-plugin-table-of-contents",
    require("./plugins/openupm-packages"),
    [
      "@vuepress/google-analytics",
      { ga: OPENUPM_REGION == "cn" ? "UA-154679622-3" : "UA-154679622-1" }
    ],
    ["vuepress-plugin-sitemap", { hostname: `https://${BASE_DOMAIN}` }],
    [
      "vuepress-plugin-seo",
      {
        image: ($page, $site) => {
          if ($page.frontmatter.image)
            return ($site.themeConfig.domain || "") + $page.frontmatter.image;
          else if ($page.frontmatter.package && $page.frontmatter.package.image)
            return $page.frontmatter.package.image;
          else
            return (
              ($site.themeConfig.domain || "") + "/images/openupm-twitter.png"
            );
        },
        type: $page =>
          ["docs"].some(folder => $page.regularPath.startsWith("/" + folder))
            ? "article"
            : "website"
      }
    ],
    [
      "flexsearch",
      {
        searchHotkeys: ["s", "/"],
        search_options: {
          encode: "icase",
          tokenize: OPENUPM_REGION == "cn" ? "cjk" : "reverse",
          resolution: 9,
          doc: {
            id: "key",
            field: ["title", "content", "headers"]
          }
        }
      }
    ]
  ],
  // eslint-disable-next-line no-unused-vars
  chainWebpack: (config, isServer) => {
    // Load js-yaml-loader
    config.module
      .rule("yaml")
      .test(/\.ya?ml$/)
      .use("js-yaml-loader")
      .loader("js-yaml-loader");
    // Load webpack-bundle-analyzer
    if (process.env.WEBPACK_BUNDLE_ANALYZER && !isServer) {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config
        .plugin("webpack-bundle-analyzer")
        .use(BundleAnalyzerPlugin)
        .init(Plugin => new Plugin());
    }
  },
  // eslint-disable-next-line no-unused-vars
  configureWebpack: (config, isServer) => {
    return {
      plugins: [
        new webpack.EnvironmentPlugin({
          OPENUPM_REGION,
          BASE_DOMAIN
        })
      ]
    };
  },
  alias: {
    "@root": path.resolve(__dirname, "../../")
  },
  shouldPrefetch: () => false
};

// Merge locale config
config.locales = regionConfig.locales;
config.themeConfig = _.merge({}, config.themeConfig, regionConfig.themeConfig);
config.head = _.concat(config.head, regionConfig.head);
config.plugins = _.concat(config.plugins, regionConfig.plugins);

// Load locale messages.
const defaultLang = config.locales["/"].lang;
const localeMessages = {};
const langs = defaultLang == "en-US" ? ["en-US"] : ["en-US", defaultLang];
for (const lang of langs) {
  const messagesFile = path.resolve(__dirname, `./locales/${lang}.yml`);
  const messages = yaml.safeLoad(fs.readFileSync(messagesFile, "utf8"));
  localeMessages[lang] = messages;
}
config.themeConfig.localeMessages = localeMessages;

// Export.
module.exports = config;
