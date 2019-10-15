// OpenUPM Package Plugin.
const yaml = require("js-yaml");
const {
  loadPackageSync,
  loadPackageNames
} = require("../../../../app/utils/package");

// eslint-disable-next-line no-unused-vars
module.exports = (options, context) => ({
  name: "openupm-packages",

  // Additional pages.
  async additionalPages() {
    let packageNames = await loadPackageNames();
    let packages = packageNames.map(loadPackageSync).filter(x => x);
    let pages = [];
    let createContent = fm => "---\n" + yaml.safeDump(fm) + "\n---\n";
    // Page index.
    let frontmatter = {
      layout: "PackageList",
      title: "Package list",
      packages
    };
    pages.push({
      path: "/packages/",
      content: createContent(frontmatter)
    });
    // Page detail.
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
