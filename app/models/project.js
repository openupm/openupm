const ProjectState = {
  // Project waiting for processing.
  pending: 'pending',
  // Project in use.
  active: 'active',
  // Project not supported yet.
  backlog: 'backlog',
  // Project not qualified (not a package or missing license).
  rejected: 'rejected',
};

const ProjectSource = {
  gitHub: 'github',
  gitLab: 'gitlab',
  git: 'git',
};

module.exports = {
  ProjectState,
  ProjectSource,
};
