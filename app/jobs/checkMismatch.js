// Check package issues

const axios = require("axios");
const { orderBy } = require("lodash/collection");
const urljoin = require("url-join");
const {
  loadPackageNames,
  loadBuiltinPackageNames,
  packageExists
} = require("../utils/package");
const logger = require("../utils/log")(module);

const checkMismatch = async function () {
  const localPackageNames = await loadPackageNames();
  const resp = await axios.get(urljoin("https://package.openupm.com/-/all"), {
    headers: { Accept: "application/json" }
  });
  const pkgInfo = resp.data;
  console.log(pkgInfo)
  console.log(packageNames.includes("com.littlebigfun.addressable-importer"))
  for (let name of packageNames) {

  }


  return;
  const builtinPackageNames = await loadBuiltinPackageNames();
  for (let name of packageNames) {
    // Verify package
    if (!packageExists(name)) {
      logger.error({ pkg: name }, "package doesn't exist");
      continue;
    }
    try {
      let resp = await axios.get(urljoin("https://package.openupm.com", name), {
        headers: { Accept: "application/json" }
      });
      const pkgInfo = resp.data;
      const version = pkgInfo["dist-tags"].latest;
      const dependencies = pkgInfo.versions[version].dependencies || {};
      const dependenciesArr = Object.entries(dependencies).map(
        ([name, version]) => ({
          name,
          version
        })
      );
      const result = { name };
      // Check missing dependencies
      const missingDeps = dependenciesArr.filter(
        x =>
          !(
            packageNames.includes(x.name) ||
            builtinPackageNames.includes(x.name) ||
            x.name.startsWith("com.unity.modules.")
          )
      );
      if (missingDeps.length) result.missingDeps = missingDeps;
      // Check git dependencies
      const gitDeps = dependenciesArr.filter(x =>
        /\.git(#.*)?$/i.test(x.version)
      );
      if (gitDeps.length) result.gitDeps = gitDeps;
      // Output
      if (Object.keys(result).length > 1) console.log(result);
    } catch (error) {
      const is404 = error.response && error.response.status == 404;
      if (is404)
        console.log({
          name,
          noGitTags: true
        });
      else logger.error(error);
    }
  }
};

if (require.main === module) {
  let program = require("../utils/commander");
  program
    .description("show difference between the package registry and package meta files")
    .parse(process.argv)
    .run(async function () {
      await checkMismatch();
    });
}
