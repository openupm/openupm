// Git util.

const eol = require("eol");
const git = require("simple-git");

// Parse remote tags output.
const parseRemoteTagsOutput = function(stdout) {
  const remotes = eol
    .split(stdout)
    .map(x => {
      let [commit, tag] = x.split("\t").filter(Boolean);
      if (tag) tag = tag.replace("refs/tags/", "");
      if (commit && tag) return { commit, tag };
    })
    .filter(Boolean);
  const results = [];
  // If both lightweight and annotated tags exist, prefers the later.
  // See https://stackoverflow.com/questions/15472107/when-listing-git-ls-remote-why-theres-after-the-tag-name
  remotes.forEach(x => {
    if (x.tag.endsWith("^{}")) {
      results.push({ commit: x.commit, tag: x.tag.replace("^{}", "") });
    } else {
      if (remotes.filter(y => y.tag == x.tag + "^{}").length == 0) {
        results.push(x);
      }
    }
  });
  return results;
};

/* Return remote tag array with item { commit, tag }, sorted by "-version:refname".
 * Tag prefix "refs/tags/" is removed.
 */
const gitListRemoteTags = async function(gitUrl) {
  let stdout = await git().listRemote(["--tags", "--sort=-version:refname", gitUrl]);
  return parseRemoteTagsOutput(stdout);
};

module.exports = { gitListRemoteTags, parseRemoteTagsOutput };
