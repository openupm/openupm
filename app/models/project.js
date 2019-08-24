// Project model.
const parseGitHubUrl = require('parse-github-url');
const { ProjectSource } = require('./common');

const projectModel = function (record) {
  return {
    ...record,

    // Git url.
    get gitUrl() {
      if (this.source == ProjectSource.gitHub) {
      }
    },

    // GitHub url parsed by parse-github-url lib.
    _gitHubUrl: null,
    get gitHubUrl() {
      if (!this.url)
        return null;
      if (!this._gitHubUrl)
        this._gitHubUrl = parseGitHubUrl(this.url);
      return this._gitHubUrl;
    }
  };
};

module.exports = { projectModel };