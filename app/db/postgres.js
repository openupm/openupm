const config = require("config");
const mockKnex = require("mock-knex");

let Knex = require("knex");
let knexStringcase = require("knex-stringcase");

let knex = Knex(knexStringcase(config.knex));

if (process.env.NODE_ENV === "test") {
  mockKnex.mock(knex);
}

// Update updateAt field to datetime now.
knex.touchUpdateAt = function(record) {
  if (typeof record === "undefined" || record === null) record = {};
  record.updatedAt = knex.fn.now();
  return record;
};

module.exports = knex;
