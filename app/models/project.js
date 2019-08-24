// Project model.
const parseGitHubUrl = require('parse-github-url');
const { ModelBase, registerModel } = require('./base');
const { ProjectSource } = require('./common');

class Project extends ModelBase {
  // Git url.
  get gitUrl() {
    if (this.source == ProjectSource.gitHub) {
      // TODO:
    }
  }

  // GitHub url parsed by parse-github-url lib.
  get gitHubUrl() {
    if (!this.url)
      return null;
    if (!this._gitHubUrl)
      this._gitHubUrl = parseGitHubUrl(this.url);
    return this._gitHubUrl;
  }
}

registerModel(Project, {
  hasTimestamps: true,
});

module.exports = { Project };
