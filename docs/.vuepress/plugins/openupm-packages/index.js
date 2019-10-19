// OpenUPM Package Plugin.
const yaml = require("js-yaml");
const {
  loadTopics,
  loadPackageSync,
  loadPackageNames
} = require("../../../../app/utils/package");

// eslint-disable-next-line no-unused-vars
module.exports = (options, context) => ({
  name: "openupm-packages",

  // Additional pages.
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
      if (!topicSlug) return true;
      else if (Array.isArray(pkg.topics)) return pkg.topics.includes(topicSlug);
      else return pkg.topics == topicSlug;
    };
    // Load topics.
    let topics = [{ name: "All", slug: "" }]
      .concat((await loadTopics()).topics)
      .map(topic => {
        return {
          ...topic,
          link: topic.slug ? `/packages/topics/${topic.slug}/` : "/packages/",
          count: packages.filter(pkg => packageTopicFilter(pkg, topic.slug))
            .length
        };
      });
    // Pages
    let pages = [];
    let createContent = fm => "---\n" + yaml.safeDump(fm) + "\n---\n";
    // List pages.
    for (let topic of topics) {
      // Skip topic with no packages.
      if (topic.slug && topic.count == 0) continue;
      let frontmatter = {
        layout: "PackageList",
        title: topic.slug ? `Packages - ${topic.name}` : "Packages",
        topics,
        topic,
        packages: packages.filter(pkg => packageTopicFilter(pkg, topic.slug))
      };
      pages.push({
        path: topic.link,
        content: createContent(frontmatter)
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
        content: createContent(frontmatter)
      });
    }
    return pages;
  }
});
