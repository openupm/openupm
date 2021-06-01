// Translate package meta data

const { Translate } = require("@google-cloud/translate").v2;

const {
  loadPackageNames,
  loadRawPackage,
  saveRawPackage
} = require("../utils/package");
const { httpErrorInfo } = require("../utils/http");

const logger = require("../utils/log")(module);
const translate = new Translate();

const translateText = async function(text) {
  const options = {
    to: "zh-CN",
    model: "nmt" // or "base"
  };
  const result = await translate.translate(text, options);
  const translation = result[0];
  logger.info({}, `${text} => ${translation}`);
  return translation;
};

const translatePackages = async function(packageNames, dryRun) {
  if (!packageNames) packageNames = [];
  let charCount = 0;
  for (let name of packageNames) {
    try {
      const rawPackage = await loadRawPackage(name);
      const meta = { ...rawPackage };
      let dirty = false;
      if (rawPackage.displayName && !rawPackage.displayName_zhCN) {
        charCount += rawPackage.displayName.length;
        if (!dryRun) {
          meta.displayName_zhCN = await translateText(rawPackage.displayName);
          dirty = true;
        }
      }
      if (rawPackage.description && !rawPackage.description_zhCN) {
        charCount += rawPackage.description.length;
        if (!dryRun) {
          meta.description_zhCN = await translateText(rawPackage.description);
          dirty = true;
        }
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
  logger.info({}, `translated chars: ${charCount}`);
};

if (require.main === module) {
  let program = require("../utils/commander");
  let packageNames = null;
  program
    .option("--all", "all packages")
    .option("--dry-run", "print untranslated characters only")
    .arguments("[name...]")
    .action(function(names) {
      packageNames = names;
    })
    .parse(process.argv)
    .run(async function() {
      if (program.all) packageNames = await loadPackageNames();
      if (packageNames === null || !packageNames.length) program.help();
      await translatePackages(packageNames, program.dryRun);
    });
}
