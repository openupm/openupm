// A tiny ORM.

const knex = require("../db/postgres");
const _ = require("lodash");

// Default model meta.
const modelMetaBase = {
  // Table name.
  table: null,
  // The primary key of the table.
  primaryKey: "id",
  // Whether the table has standard timestamp fields create_at and update_at.
  hasTimestamps: false
};

// Register model with meta data.
const registerModel = function(cls, meta) {
  // Add meta instance to cls.meta.
  let obj = {};
  _.merge(obj, modelMetaBase);
  _.merge(obj, meta);
  if (!obj.table) obj.table = cls.name.toLowerCase();
  cls.meta = obj;

  // Return one model instance by primary key or lookup condition.
  cls.fetchOne = async function(pkOrLookup, fields) {
    let meta = this.meta;
    let lookup = {};
    if (typeof pkOrLookup == "object") lookup = pkOrLookup;
    else lookup[meta.primaryKey] = pkOrLookup;
    let query = knex(meta.table);
    if (fields) query = query.select(...fields);
    else query.select("*");
    let record = await query.where(lookup).first();
    if (!record) return null;
    return new this(record);
  };

  // Return one model instance by primary key or lookup condition,
  // throw error if not found.
  cls.fetchOneOrThrow = async function(pkOrLookup) {
    let record = await cls.fetchOne(pkOrLookup);
    if (record === null) {
      let condStr = JSON.stringify(pkOrLookup);
      throw new Error(`Failed to fetch ${cls.name} record, ${condStr}`);
    }
    return record;
  };

  // Return a list of model instances by lookup condition.
  // If callback(query) provided, it shall return the query object.
  cls.fetchAll = async function(lookupOrCallback, fields, orderBy) {
    let meta = this.meta;
    let query = knex(meta.table);
    if (fields) query = query.select(...fields);
    else query = query.select("*");
    if (lookupOrCallback) {
      if (typeof lookupOrCallback == "object")
        query = query.where(lookupOrCallback);
      else if (typeof lookupOrCallback == "function")
        query = lookupOrCallback(query);
    }
    if (orderBy) query = query.orderBy(...orderBy);
    let records = await query;
    return records.map(x => new this(x));
  };

  // Return created model instance.
  cls.create = async function(record) {
    let meta = this.meta;
    let pks = await knex(meta.table)
      .insert(record)
      .returning(meta.primaryKey);
    let pk = pks[0];
    return await this.fetchOne(pk);
  };
};

// Model base class.
class ModelBase {
  constructor(record) {
    Object.assign(this, record);
  }

  // Update given record to model and save to database.
  async update(record) {
    let meta = this.constructor.meta;
    if (meta.hasTimestamps) knex.touchupdatedAt(record);
    Object.assign(this, record);
    let primaryKeyLookup = {};
    primaryKeyLookup[meta.primaryKey] = this[meta.primaryKey];
    await knex(meta.table)
      .update(record)
      .where(primaryKeyLookup);
    return this;
  }
}

module.exports = {
  ModelBase,
  registerModel
};
