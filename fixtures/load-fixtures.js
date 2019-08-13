// Load fixture into database

const fs = require("fs");
const path = require("path");
const knex = require('../app/db/postgres');
const fixturesPath = path.resolve(__dirname, "fixtures.json");
const logger = require('../app/utils/log')(module);

var loadFixture = function () {
  var fixtures = JSON.parse(fs.readFileSync(fixturesPath));
  knex('project').insert(fixtures.list)
    .then(() => logger.info("data inserted"))
    .catch((err) => { logger.error(err); throw err })
    .finally(() => { knex.destroy(); });
};

if (require.main === module) {
  loadFixture();
}
