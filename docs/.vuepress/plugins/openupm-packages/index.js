// OpenUPM Package Plugin.
const spdx = require("spdx-license-list");
const yaml = require("js-yaml");
const {
  loadTopics,
  loadPackageSync,
  loadPackageNames
} = require("../../../../app/utils/package");

// eslint-disable-next-line no-unused-vars
module.exports = (options, context) => ({
  name: "openupm-packages",

  async extendPageData($page) {
    let packageNames = await loadPackageNames();
    $page.packageCount = packageNames.length;
  },

  async additionalPages() {
    // Load packages.
    let packageNames = await loadPackageNames();
    let packages = packageNames
      .map(loadPackageSync)
      .filter(x => x)
      .map(pkg => {
        return {
          ...pkg,
          link: {
            link: `/packages/${pkg.name}/`,
            text: pkg.displayName || pkg.name
          }
        };
      })
      // Sort by name
      .sort(function(a, b) {
        let va = a.link.text.toLowerCase();
        let vb = b.link.text.toLowerCase();
        if (va < vb) return -1;
        if (va > vb) return 1;
        return 0;
      });
    // Package topic filter function.
    let packageTopicFilter = (pkg, topicSlug) => {
      if (pkg.excludedFromList) return false;
      else if (!topicSlug) return true;
      else if (Array.isArray(pkg.topics)) return pkg.topics.includes(topicSlug);
      else return pkg.topics == topicSlug;
    };
    // Load topics.
    let topicsWithAll = [{ name: "All", slug: "" }]
      .concat((await loadTopics()).topics)
      .map(topic => {
        return {
          ...topic,
          link: topic.slug ? `/packages/topics/${topic.slug}/` : "/packages/",
          count: packages.filter(pkg => packageTopicFilter(pkg, topic.slug))
            .length
        };
      });
    let topics = topicsWithAll.slice(1);
    // Pages
    let pages = [];
    let createPageContent = fm => "---\n" + yaml.safeDump(fm) + "\n---\n";
    // List pages.
    for (let topic of topicsWithAll) {
      // Skip topic with no packages.
      if (topic.slug && topic.count == 0) continue;
      let frontmatter = {
        layout: "PackageList",
        title: topic.slug ? `Packages - ${topic.name}` : "Packages",
        topics: topicsWithAll,
        topic,
        packages: packages.filter(pkg => packageTopicFilter(pkg, topic.slug))
      };
      pages.push({
        path: topic.link,
        content: createPageContent(frontmatter)
      });
    }
    // Detail pages.
    for (let pkg of packages) {
      let frontmatter = {
        layout: "PackageDetail",
        title: pkg.displayName ? `${pkg.displayName} ${pkg.name}` : pkg.name,
        package: pkg
      };
      pages.push({
        path: "/packages/" + pkg.name + "/",
        content: createPageContent(frontmatter)
      });
    }
    // Add pages.
    pages.push({
      path: "/packages/add/",
      content: createPageContent({
        layout: "PackageAdd",
        title: "Package Add",
        licenses: Object.keys(spdx)
          .sort(function(a, b) {
            return spdx[a].name
              .toLowerCase()
              .localeCompare(spdx[b].name.toLowerCase());
          })
          .map(function(key) {
            return { id: key, name: spdx[key].name };
          }),
        packageNames,
        topics
      })
    });
    return pages;
  }
});
