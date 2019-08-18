const config = require('config');

let knex = require('knex')(config.knex);

knex.touchUpdateAt = function (row) {
  if (typeof row === 'undefined' || row === null)
    row = {};
  row.updated_at = knex.fn.now();
  return row;
};

module.exports = knex;
