const config = require("config");

/**
 * Return GitHub token from the configuration.
 * @returns The GitHub token.
 */
function getGithubToken() {
  if (config.github.tokens && config.github.tokens.length > 0)
    // Return random token from the list.
    return config.github.tokens[
      Math.floor(Math.random() * config.github.tokens.length)
    ];
  // Fall back to the single token.
  if (config.github.token) return config.github.token;
}

module.exports = { getGithubToken };
