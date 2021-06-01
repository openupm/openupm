/**
 * Constants that shared both server and client.
 **/

/* eslint-disable no-unused-vars */

const Enum = require("enum");

const ReleaseState = new Enum({
  Pending: 0,
  Building: 1,
  Succeeded: 2,
  Failed: 3
});

const ReleaseReason = new Enum({
  None: 0,
  // Bad request
  BadRequest: 400,
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
  // Server bad gateway
  GatewayTimeout: 504,
  // Build timeout.
  BuildTimeout: 700,
  // BuildCancellation
  BuildCancellation: 701,
  // Missing package.json
  PackageNotFound: 800,
  // Private repo
  Private: 801,
  // Package name invalid
  PackageNameInvalid: 803,
  // Invalid format of package.json
  PackageJsonParsingError: 804,
  // Invalid remote branch
  RemoteBranchNotFound: 805,
  // Invalid version
  InvalidVersion: 806,
  // Could not read from remote repository
  RemoteRepositoryUnavailable: 807,
  // Connection timeout
  ConnectionTime: 900,
  // Connection timeout
  HeapOutOfMemroy: 901
});

/* Release reasons that considered as the failure of build service. The
 * build should be retired whenever possible.
 */
const RetryableReleaseReason = [
  ReleaseReason.None,
  ReleaseReason.BadRequest,
  ReleaseReason.Unauthorized,
  ReleaseReason.Forbidden,
  ReleaseReason.EntityTooLarge,
  ReleaseReason.InternalError,
  ReleaseReason.BadGateway,
  ReleaseReason.ServiceUnavailable,
  ReleaseReason.GatewayTimeout,
  ReleaseReason.BuildTimeout,
  ReleaseReason.BuildCancellation
];

module.exports = {
  ReleaseState,
  ReleaseReason,
  RetryableReleaseReason
};
