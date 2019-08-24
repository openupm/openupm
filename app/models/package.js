// Package model.
const { ModelBase, registerModel } = require('./base');

class Package extends ModelBase {}

registerModel(Package, {
  hasTimestamps: true,
});

module.exports = { Package };
