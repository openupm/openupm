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
    throw new ValidationError("package name should not be empty", "empty");
  const maxLength = 214;
  if (packageName.length > maxLength)
    throw new ValidationError(
      `package name length should be less or equal to ${maxLength}, but length is ${packageName.length}`,
      "max-length-error"
    );
  const nameRe = /^[a-z0-9._-]+$/;
  if (!nameRe.test(packageName))
    throw new ValidationError(
      "package name should contain only lowercase letters, digits, hyphens(-), underscores (_), and periods (.)",
      "invalid-characters-error"
    );
  const items = packageName.split(".");
  if (items.length < 3)
    throw new ValidationError(
      "package name should conform to reverse domain name notation with at least 3 components (tld.org-name.pkg-name)",
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

/**
 * Return if the package name is blocked by the given block scope
 * @param {String} packageName
 * @param {String} scope
 * @returns {Boolean}
 */
const isPackageBlockedByScope = function(packageName, scope) {
  if (scope.startsWith("^"))
    return packageName.startsWith(scope.slice(1, scope.length));
  else
    return packageName ==  scope;
}

module.exports = {
  getCachedAvatarImageFilename,
  isPackageBlockedByScope,
  isValidPackageName,
  validPackageName
};
