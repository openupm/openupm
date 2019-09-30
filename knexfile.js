// Update with your config settings.
const config = require("config");

module.exports = {
  development: config.knex,
  production: config.knex
};
