const config = require("config");
const mockKnex = require("mock-knex");

let knex = require("knex")(config.knex);

if (process.env.NODE_ENV === "test") {
  mockKnex.mock(knex);
}

// Update update_at field to datetime now.
knex.touchUpdateAt = function(record) {
  if (typeof record === "undefined" || record === null) record = {};
  record.updated_at = knex.fn.now();
  return record;
};

module.exports = knex;
