const { addTimestamps } = require("./helpers.js");

exports.up = function(knex) {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "citext"')
    .createTable("release", function(table) {
      table.increments("id");
      table.specificType("package_name", "CITEXT").notNullable();
      table
        .string("version")
        .notNullable()
        .defaultTo("");
      table
        .string("commit")
        .notNullable()
        .defaultTo("");
      table
        .string("tag")
        .notNullable()
        .defaultTo("");
      table
        .integer("state")
        .notNullable()
        .defaultTo(0);
      table
        .string("build_id")
        .notNullable()
        .defaultTo("");
      table
        .text("publish_log")
        .notNullable()
        .defaultTo("");
      table
        .integer("reason")
        .notNullable()
        .defaultTo(0);
      addTimestamps(knex, table);
      table.unique(["package_name", "version"]);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable("release");
};
