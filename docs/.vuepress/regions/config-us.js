/**
 * Configuration for region us (lang en-us)
 */

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
        "/docs/opt-out",
        "/support/"
      ]
    },
    {
      title: "NuGet",
      collapsable: false,
      children: [
        "/nuget/"
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
  locales: {
    "/": {
      lang: "en-US",
      title: "OpenUPM",
      description:
        "OpenUPM is a managed UPM registry with automatic build services for open-source Unity packages."
    }
  },
  head: [
    [
      "meta",
      {
        name: "keywords",
        content: "openupm,upm,registry,unity,package,manager,open source"
      }
    ]
  ],
  themeConfig: {
    locales: {
      "/": {
        nav: [
          {
            text: "Packages",
            link: "/packages/"
          },
          {
            text: "NuGet",
            link: "/nuget/"
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
                text: "GitHub Discussions",
                link: "https://github.com/openupm/openupm/discussions",
                icon: "fas fa-hands-helping",
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
                link: "https://api.openupm.com/feeds/updates/rss",
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
          },
          {
            text: "Region",
            ariaLabel: "Region Menu",
            items: [
              { text: "Global", link: "/" },
              { text: "China/中文区", link: "https://openupm.cn" }
            ]
          }
        ],
        sidebar: {
          "/docs/": docSideBar(),
          "/nuget/": docSideBar(),
          "/support/": docSideBar(),
        }
      }
    }
  },
  plugins: [
    [
      "vuepress-plugin-social-share",
      {
        networks: [
          "twitter",
          "facebook",
          "reddit",
          "telegram",
          "line",
          "whatsapp"
        ],
        fallbackImage: "/images/openupm-icon-256.png"
      }
    ]
  ]
};
