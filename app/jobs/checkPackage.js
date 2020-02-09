// Check package issues

const axios = require("axios");
const urljoin = require("url-join");
const {
  loadPackageNames,
  loadBuiltinPackageNames,
  packageExists
} = require("../utils/package");
const logger = require("../utils/log")(module);

const checkDependencies = async function(packageNames) {
  if (!packageNames) packageNames = [];
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
  let packageNames = null;
  program
    .option("--all", "check dependencies for all packages")
    .arguments("[name...]")
    .action(function(names) {
      packageNames = names;
    })
    .parse(process.argv)
    .run(async function() {
      if (program.all) packageNames = await loadPackageNames();
      if (packageNames === null || !packageNames.length) program.help();
      await checkDependencies(packageNames);
    });
}
