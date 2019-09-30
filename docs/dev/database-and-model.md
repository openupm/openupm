---
title: Database and model
---
# Database and Model

The system uses PostgreSQL to store server side information like build state. To interactive with database, it wraps [knex](http://knexjs.org/) with a tiny ORM level locate at `app/models/base.js`.

## Declare Model

- Create a sub-class derived from ModelBase.
- Register model with meta data.

```js
const { ModelBase, registerModel } = require("./base");

class MyModel extends ModelBase {
  // custom methods...
}

registerModel(Release, {
  // table: null,
  // primaryKey: "id",
  hasTimestamps: true
});
```

## Consume Model

```js
// Fetch record by primary key.
let record = await MyModel.fetchOne(1);

// Fetch record by condition.
let record = await MyModel.fetchOne({name: 'package-name'});

// Fetch record by condition and throw error if no found.
let record = await MyModel.fetchOneOrThrow({name: 'package-name'});

// Fetch all records by condition.
let record = await MyModel.fetchAll({name: 'package-name'});

// Fetch all records by callback.
let record = await MyModel.fetchAll(query => { return query... });

// Create a record.
let record = await MyModel.create({...});

// Update a record.
await record.update({...})
```
