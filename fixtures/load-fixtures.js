// Load fixture into database

const fs = require("fs");
const path = require("path");
const knex = require("../app/db/postgres");
const fixturesPath = path.resolve(__dirname, "fixtures.json");
const logger = require("../app/utils/log")(module);

var loadFixture = async function() {
  logger.info("Load fixtures start.");
  var fixtures = JSON.parse(fs.readFileSync(fixturesPath));
  await knex("project").insert(fixtures.list);
  await knex.destroy();
  logger.info("Load fixtures done.");
};

if (require.main === module) {
  loadFixture()
    .catch(logger.error)
    .finally(() => process.exit(0));
}
