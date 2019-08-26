// Common models and constants.

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

const ReleaseState = {
  // Release waiting for processing.
  pending: 'pending',
  // Release in processing.
  building: 'building',
  // Release build succeeded.
  succeeded: 'succeeded',
  // Release build failed.
  failed: 'failed',
};

module.exports = {
  ProjectState,
  ProjectSource,
  ReleaseState,
};
