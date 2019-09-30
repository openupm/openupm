const config = require("config");

let knex = require("knex")(config.knex);

// Update update_at field to datetime now.
knex.touchUpdateAt = function(record) {
  if (typeof record === "undefined" || record === null) record = {};
  record.updated_at = knex.fn.now();
  return record;
};

module.exports = knex;
