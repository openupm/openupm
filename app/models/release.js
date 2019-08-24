// Release model.
const { ModelBase, registerModel } = require('./base');

class Release extends ModelBase {}

registerModel(Release, {
  hasTimestamps: true,
});

module.exports = { Release };
