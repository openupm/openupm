// Translate package meta data

const translate = require("@vitalets/google-translate-api");

const {
  loadPackageNames,
  loadRawPackage,
  saveRawPackage
} = require("../utils/package");
const { httpErrorInfo } = require("../utils/http");
const logger = require("../utils/log")(module);

const translatePackages = async function(packageNames) {
  if (!packageNames) packageNames = [];
  for (let name of packageNames) {
    try {
      const rawPackage = await loadRawPackage(name);
      const meta = { ...rawPackage };
      let dirty = false;
      if (rawPackage.displayName && rawPackage.displayName_zhCN) {
        if (
          rawPackage.displayName_zhCN.toLowerCase() ==
            rawPackage.displayName.toLowerCase() ||
          rawPackage.displayName_zhCN.toLowerCase() ==
            rawPackage.displayName.toLowerCase() + "."
        ) {
          meta.displayName_zhCN = rawPackage.displayName;
          dirty = true;
        }
      }
      if (rawPackage.displayName && !rawPackage.displayName_zhCN) {
        const res = await translate(rawPackage.displayName, { to: "zh-CN" });
        meta.displayName_zhCN = res.text;
        dirty = true;
      }
      if (rawPackage.description && !rawPackage.description_zhCN) {
        const res = await translate(rawPackage.description, { to: "zh-CN" });
        meta.description_zhCN = res.text;
        dirty = true;
      }
      if (dirty) {
        logger.info({ pkg: name }, "changed");
        await saveRawPackage(name, meta);
      }
    } catch (error) {
      logger.error(httpErrorInfo(error, { pkg: name }), "translate error");
      if (error.code == "BAD_REQUEST") break;
    }
  }
};

if (require.main === module) {
  let program = require("../utils/commander");
  let packageNames = null;
  program
    .option("--all", "all packages")
    .arguments("[name...]")
    .action(function(names) {
      packageNames = names;
    })
    .parse(process.argv)
    .run(async function() {
      if (program.all) packageNames = await loadPackageNames();
      if (packageNames === null || !packageNames.length) program.help();
      await translatePackages(packageNames);
    });
}
