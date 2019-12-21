const path = require("path");
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
        href: "https://use.fontawesome.com/releases/v5.11.2/css/all.css"
      }
    ]
  ],
  themeConfig: {
    repo: "https://github.com/openupm/openupm",
    editLinks: true,
    docsDir: "",
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
      }
    ],
    sidebar: {
      "/docs/": [
        {
          title: "Guide",
          collapsable: false,
          children: [
            "",
            "getting-started",
            "adding-upm-package",
            "modifying-upm-package"
          ]
        },
        {
          title: "Resources",
          collapsable: false,
          children: ["team", "terms", "code-of-conduct"]
        }
      ]
    }
  },
  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    "@vuepress/plugin-back-to-top",
    "@vuepress/plugin-medium-zoom",
    require("./plugins/openupm-packages")
  ],
  // eslint-disable-next-line no-unused-vars
  chainWebpack: (config, isServer) => {
    config.module
      .rule("yaml")
      .test(/\.ya?ml$/)
      .use("js-yaml-loader")
      .loader("js-yaml-loader");
  },
  alias: {
    "@root": path.resolve(__dirname, "../../")
  }
};
