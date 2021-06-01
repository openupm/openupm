/**
 * Fetch backer data
 **/
const config = require("config");
const fs = require("fs");
const path = require("path");
const util = require("util");

const yaml = require("js-yaml");

const { cacheAvatarImageForGithubUser } = require("./fetchPackageExtra");
const { healthCheck } = require("../utils/healthCheck");
const logger = require("../utils/log")(module);

const readFile = util.promisify(fs.readFile);
const backersPath = path.resolve(__dirname, "../../data/backers.yml");

/**
 * Fetch backer data
 * @param {Array} packageNames
 * @param {Boolean} force
 */
const fetchBackerData = async function(force) {
  logger.info("fetchBackerData");
  const backers = yaml.safeLoad(await readFile(backersPath, "utf8"));
  for (const backer of backers.items) {
    if (backer.githubUser)
      await cacheAvatarImageForGithubUser(backer.githubUser, force);
  }
};

if (require.main === module) {
  let program = require("../utils/commander");
  program
    .option("-f, --force", "ignore cache and force to fetch stuffs")
    .arguments("[name...]")
    .parse(process.argv)
    .run(async function() {
      await fetchBackerData(program.force);
      await healthCheck(config.healthCheck.ids.fetchBackerData);
    });
}
