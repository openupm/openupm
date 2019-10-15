const { description } = require("../../package");

module.exports = {
  title: "OpenUPM",
  description: description,
  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
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
        href:
          "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
      }
    ]
  ],

  themeConfig: {
    repo: "https://github.com/openupm/openupm",
    editLinks: false,
    docsDir: "",
    editLinkText: "",
    lastUpdated: false,
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
        text: "Donate",
        link: "/donate/"
      },
      {
        text: "Login",
        link: "/login/"
      }
    ]
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    "@vuepress/plugin-back-to-top",
    "@vuepress/plugin-medium-zoom",
    "vuepress-plugin-clean-urls",
    {
      normalSuffix: "/",
      indexSuffix: "/",
      notFoundPath: "/404.html"
    },
    require("./plugins/openupm-packages")
  ],

  // eslint-disable-next-line no-unused-vars
  chainWebpack: (config, isServer) => {
    config.module
      .rule("yaml")
      .test(/\.ya?ml$/)
      .use("js-yaml-loader")
      .loader("js-yaml-loader");
  }
};
