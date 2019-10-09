// Release model.
const config = require("config");
const urljoin = require("url-join");

const { ModelBase, registerModel } = require("./base");

class Release extends ModelBase {
  // Get build url (json).
  get buildUrl() {
    return urljoin(
      config.azureDevops.buildUrlBase,
      "_apis/build/Builds/",
      this.buildId
    );
  }

  // Get build web url.
  get buildWebUrl() {
    return urljoin(
      config.azureDevops.buildUrlBase,
      "_build/results?buildId=",
      this.buildId
    );
  }

  // Get build timeline url (json).
  get buildTimelineUrl() {
    return urljoin(
      config.azureDevops.buildUrlBase,
      "_apis/build/builds/",
      this.buildId,
      "Timeline"
    );
  }

  // Get build publish result url (json).
  get buildPublishResultUrl() {
    // TODO: find url from buildTimelineUrl content.
    return urljoin(
      config.azureDevops.buildUrlBase,
      "_apis/build/builds/",
      this.buildId,
      "logs/13"
    );
  }
}

registerModel(Release, {
  hasTimestamps: true
});

module.exports = { Release };
