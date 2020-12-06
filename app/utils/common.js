/**
 * Common utils that shared with client side.
 **/

/* eslint-disable no-unused-vars */

const { isValidPackageName } = require("./package");

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
  isValidPackageName
};
