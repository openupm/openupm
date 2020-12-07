/**
 * Utils that shared both server and client.
 **/

const { ValidationError } = require("./customError");

/* eslint-disable no-unused-vars */

// Return whether a package name is valid and the ValidationError instance
const isValidPackageName = function(packageName) {
  try {
    return [validPackageName(packageName), null];
  } catch (error) {
    if (error instanceof ValidationError) return [false, error];
    throw error;
  }
};

// Validate a package name based on https://docs.unity3d.com/Manual/cus-naming.html
const validPackageName = function(packageName) {
  if (!packageName)
    throw new ValidationError("name should not be empty", "empty");
  const maxLength = 214;
  if (packageName.length > maxLength)
    throw new ValidationError(
      `name length should be less or equal to ${maxLength}`,
      "max-length-error"
    );
  const nameRe = /^[a-z0-9._-]+$/;
  if (!nameRe.test(packageName))
    throw new ValidationError(
      "name should contain only lowercase letters, digits, hyphens(-), underscores (_), and periods (.)",
      "invalid-characters-error"
    );
  const items = packageName.split(".");
  if (items.length < 3)
    throw new ValidationError(
      "name should conform to reverse domain name notation",
      "invalid-scopes-error"
    );
  return true;
};

/**
 * Get the cached avatar image filename
 * @param {string} username
 * @param {Number} size
 */
const getCachedAvatarImageFilename = function(username, size) {
  username = username.toLowerCase();
  return `${username}-${size}x${size}.png`;
};

module.exports = {
  getCachedAvatarImageFilename,
  isValidPackageName,
  validPackageName
};
