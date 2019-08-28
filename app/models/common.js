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

const ReleaseReason = {
  // Server 500 error, bad gateway.
  serverError: 'server-error',
  // Server 502 error, bad gate way.
  badGateway: 'bad-gateway',
  // Timeout.
  timeout: 'timeout',
  // Version conflict.
  publishConflict: 'publish-conflict',
  // package.json not found.
  nonPackage: 'non-package'
};

module.exports = {
  ProjectState,
  ProjectSource,
  ReleaseState,
  ReleaseReason,
};
