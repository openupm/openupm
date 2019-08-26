// Project model.
const parseGitHubUrl = require('parse-github-url');
const urljoin = require('url-join');
const { ModelBase, registerModel } = require('./base');
const { ProjectSource } = require('./common');

class Project extends ModelBase {
  // Git url.
  get gitUrl() {
    let url = this.gitHubUrl;
    return urljoin(url.protocol, url.host, url.repo + '.git');
  }

  // GitHub url parsed by parse-github-url lib.
  get gitHubUrl() {
    return parseGitHubUrl(this.url);
  }
}

registerModel(Project, {
  hasTimestamps: true,
});

module.exports = { Project };
