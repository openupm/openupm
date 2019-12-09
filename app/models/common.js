/* eslint-disable no-unused-vars */
// Common models and constants.

const Enum = require("enum");

const ReleaseState = new Enum({
  Pending: 0,
  Building: 1,
  Succeeded: 2,
  Failed: 3
});

const ReleaseReason = new Enum({
  None: 0,
  // Unauthorized
  Unauthorized: 401,
  // Permission error
  Forbidden: 403,
  // Entity too large
  EntityTooLarge: 413,
  // Publish Version conflict
  VersionConflict: 409,
  // Server internal error
  InternalError: 500,
  // Server bad gateway
  BadGateway: 502,
  // Server bad gateway
  ServiceUnavailable: 503,
  // Build timeout.
  BuildTimeout: 700,
  // BuildCancellation
  BuildCancellation: 701,
  // Missing package.json
  PackageNotFound: 800,
  // private repo
  Private: 801
});

/* Release reasons that considered as the failure of build service. The
 * build should be retired whenever possible.
 */
const RetryableReleaseReason = [
  ReleaseReason.Unauthorized,
  ReleaseReason.Forbidden,
  ReleaseReason.EntityTooLarge,
  ReleaseReason.InternalError,
  ReleaseReason.BadGateway,
  ReleaseReason.ServiceUnavailable,
  ReleaseReason.BuildTimeout,
  ReleaseReason.BuildCancellation
];

module.exports = {
  ReleaseState,
  ReleaseReason,
  RetryableReleaseReason
};
