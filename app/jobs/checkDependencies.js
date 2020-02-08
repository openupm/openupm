// Check dependencies

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
    // Verify package.
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
      const dependencies = Object.keys(
        pkgInfo.versions[version].dependencies || {}
      );
      const missingDeps = dependencies.filter(
        x =>
          !(
            packageNames.includes(x) ||
            builtinPackageNames.includes(x) ||
            x.startsWith("com.unity.modules.")
          )
      );
      if (missingDeps.length) console.log({ name, missingDeps });
    } catch (error) {
      const is404 = error.response && error.response.status == 404;
      if (!is404) console.error(error);
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
