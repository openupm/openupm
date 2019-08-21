
const { addTimestamps } = require('./helpers.js');

exports.up = function (knex) {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "citext"')
    .createTable('user', function (table) {
      table.increments('id');
      table.specificType('email', 'CITEXT').notNullable().defaultTo('');
      table.string('source').notNullable().defaultTo('');
      table.specificType('github_username', 'CITEXT').notNullable().defaultTo('');
      addTimestamps(knex, table);
      table.unique('email');
    })
    .createTable('project', function (table) {
      table.increments('id');
      table.string('state').notNullable().defaultTo('');
      table.string('source').notNullable().defaultTo('');
      table.specificType('url', 'CITEXT').notNullable().defaultTo('');
      table.string('name').notNullable().defaultTo('');
      table.string('owner').notNullable().defaultTo('');
      table.specificType('owner_avatar_url', 'CITEXT').notNullable().defaultTo('');
      table.text('description').notNullable().defaultTo('');
      table.specificType('og_image_url', 'CITEXT').notNullable().defaultTo('');
      table.boolean('use_og_image').notNullable().defaultTo(false);
      table.boolean('is_archived').notNullable().defaultTo(false);
      table.boolean('is_fork').notNullable().defaultTo(false);
      table.string('license_key').notNullable().defaultTo('');
      table.string('license_name').notNullable().defaultTo('');
      table.boolean('is_license_ok').notNullable().defaultTo(false);
      table.string('repo_branch').notNullable().defaultTo('');
      table.boolean('has_package').notNullable().defaultTo(false);
      table.integer('star').notNullable().defaultTo(0);
      table.integer('user_id');
      table.integer('category_id');
      table.timestamp('pushed_at', { useTz: false });
      addTimestamps(knex, table);
      table.unique('url');
    })
    .createTable('package', function (table) {
      table.increments('id');
      table.integer('project_id').notNullable();
      table.specificType('name', 'CITEXT').notNullable().defaultTo('');
      table.string('display_name').notNullable().defaultTo('');
      table.text('description').notNullable().defaultTo('');
      table.string('repo_branch').notNullable().defaultTo('');
      addTimestamps(knex, table);
      table.unique('name');
    })
    .createTable('category', function (table) {
      table.increments('id');
      table.string('name').notNullable().defaultTo('');
      table.string('slug').notNullable().defaultTo('');
      table.unique('slug');
    })
    .createTable('release', function (table) {
      table.increments('id');
      table.integer('package_id').notNullable();
      table.string('name_with_version').notNullable().defaultTo('');
      table.string('version').notNullable().defaultTo('');
      table.string('commit').notNullable().defaultTo('');
      table.string('tag').notNullable().defaultTo('');
      table.string('state').notNullable().defaultTo('');
      addTimestamps(knex, table);
      table.unique('name_with_version');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('user')
    .dropTable('project')
    .dropTable('package')
    .dropTable('category')
    .dropTable('release');
};
