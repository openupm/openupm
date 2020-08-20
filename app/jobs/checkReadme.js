// Check package readme

const axios = require("axios");
const urljoin = require("url-join");
const { AxiosService } = require("../utils/http");
const {
  loadPackageNames,
  packageExists,
  loadPackage
} = require("../utils/package");
const logger = require("../utils/log")(module);

const checkReadme = async function(packageNames) {
  if (!packageNames) packageNames = [];
  for (let name of packageNames) {
    // Verify package
    if (!packageExists(name)) {
      logger.error({ pkg: name }, "package doesn't exist");
      continue;
    }
    const pkg = await loadPackage(name);
    try {
      const [branch, path] = pkg.readme.split(":");
      const url = urljoin("https://github.com/", pkg.repo, "raw", branch, path);
      console.log(url);
      const resp = await AxiosService.create().get(url);
    } catch (error) {
      const is404 = error.response && error.response.status == 404;
      if (is404)
        console.log({
          name,
          readme: false
        });
      else logger.error(error);
    }
  }
};

if (require.main === module) {
  let program = require("../utils/commander");
  let packageNames = null;
  program
    .option("--all", "check readme for all packages")
    .arguments("[name...]")
    .action(function(names) {
      packageNames = names;
    })
    .parse(process.argv)
    .run(async function() {
      if (program.all) packageNames = await loadPackageNames();
      if (packageNames === null || !packageNames.length) program.help();
      await checkReadme(packageNames);
    });
}
