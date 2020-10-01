const path = require("path");
const { description } = require("../../package");

const docSideBar = function() {
  return [
    {
      title: "Guide",
      collapsable: false,
      children: [
        "/docs/",
        "/docs/getting-started",
        "/docs/adding-upm-package",
        "/docs/modifying-upm-package",
        "/support/"
      ]
    },
    {
      title: "Package Creator Guide",
      collapsable: false,
      children: ["/docs/adding-badge", "/docs/managing-upm-project"]
    },
    {
      title: "Development Guide",
      collapsable: true,
      children: ["/docs/dev/"]
    },
    {
      title: "Resources",
      collapsable: true,
      children: [
        "/docs/team",
        "/docs/terms",
        "/docs/code-of-conduct",
        "/docs/privacy"
      ]
    }
  ];
};

module.exports = {
  title: "OpenUPM",
  description: description,
  head: [
    [
      "meta",
      {
        name: "keywords",
        content: "openupm,upm,registry,unity,package,manager,open source"
      }
    ],
    ["meta", { name: "theme-color", content: "#3068E5" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" }
    ],
    [
      "link",
      { rel: "stylesheet", href: "https://use.typekit.net/uwx2pxu.css" }
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://use.fontawesome.com/releases/v5.11.2/css/all.css"
      }
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href:
          "https://cdn.jsdelivr.net/npm/cookieconsent@3.1.1/build/cookieconsent.min.css"
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
        href: "https://openupm.com/feeds/updates/rss"
      }
    ],
    [
      "link",
      {
        rel: "alternate",
        type: "application/rss+atom",
        href: "https://openupm.com/feeds/updates/atom"
      }
    ],
    [
      "link",
      {
        rel: "alternate",
        type: "application/json",
        href: "https://openupm.com/feeds/updates/json"
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
    domain: "https://openupm.com",
    repo: "https://github.com/openupm/openupm",
    editLinks: true,
    docsDir: "docs",
    lastUpdated: false,
    smoothScroll: true,
    logo: "/images/openupm-icon-128.png",
    nav: [
      {
        text: "Packages",
        link: "/packages/"
      },
      {
        text: "Docs",
        link: "/docs/"
      },
      {
        text: "Support",
        ariaLabel: "Support Menu",
        items: [
          { text: "Support OpenUPM", link: "/support/" },
          { text: "Contributors", link: "/contributors/" }
        ]
      },
      {
        text: "Connect",
        ariaLabel: "Connect Menu",
        items: [
          {
            text: "GitHub",
            link: "https://github.com/openupm/openupm",
            icon: "fab fa-github",
            iconLeft: true
          },
          {
            text: "Medium",
            link: "https://medium.com/openupm",
            icon: "fab fa-medium",
            iconLeft: true
          },
          {
            text: "Twitter",
            link: "https://twitter.com/openupmupdate",
            icon: "fab fa-twitter",
            iconLeft: true
          },
          {
            text: "Discord",
            link: "https://discord.gg/FnUgWEP",
            icon: "fab fa-discord",
            iconLeft: true
          },
          {
            link: "mailto:hello@openupm.com",
            text: "Contact Us",
            icon: "fas fa-envelope",
            iconLeft: true
          },
          {
            link: "/feeds/updates/rss",
            text: "Package Updates",
            icon: "fa fa-rss-square",
            raw: true,
            iconLeft: true
          }
        ]
      },
      {
        text: "CLI",
        link: "https://github.com/openupm/openupm-cli#openupm-cli",
        icon: "fa fa-keyboard",
        iconLeft: true
      }
    ],
    sidebar: {
      "/docs/": docSideBar(),
      "/support/": docSideBar()
    }
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
    "@vuepress/plugin-medium-zoom",
    "vuepress-plugin-table-of-contents",
    [
      "vuepress-plugin-social-share",
      {
        networks: ["twitter", "facebook", "telegram"],
        fallbackImage: "/images/openupm-icon-256.png"
      }
    ],
    require("./plugins/openupm-packages"),
    ["@vuepress/google-analytics", { ga: "UA-154679622-1" }],
    ["vuepress-plugin-sitemap", { hostname: "https://openupm.com" }],
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
          tokenize: "reverse",
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
    config.module
      .rule("yaml")
      .test(/\.ya?ml$/)
      .use("js-yaml-loader")
      .loader("js-yaml-loader");
    if (process.env.WEBPACK_BUNDLE_ANALYZER && !isServer) {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config
        .plugin("webpack-bundle-analyzer")
        .use(BundleAnalyzerPlugin)
        .init(Plugin => new Plugin());
    }
  },
  alias: {
    "@root": path.resolve(__dirname, "../../")
  },
  shouldPrefetch: () => false
};
