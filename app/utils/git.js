// Git util.

const eol = require("eol");
const git = require("simple-git/promise");

// Return remote tag array with item { commit, tag }, sorted by "-version:refname".
// Tag prefix "refs/tags/" is removed.
const gitListRemoteTags = async function(gitUrl) {
  let stdout = await git()
    .silent(true)
    .listRemote(["--tags", "--sort=-version:refname", gitUrl]);
  let remotes = [];
  let lines = eol.split(stdout);
  lines.forEach(line => {
    let [commit, tag] = line.split("\t").filter(Boolean);
    if (tag) tag = tag.replace("refs/tags/", "");
    // Filter out non-tag object.
    // https://stackoverflow.com/questions/15472107/when-listing-git-ls-remote-why-theres-after-the-tag-name
    if (commit && tag && !tag.endsWith("^{}")) remotes.push({ commit, tag });
  });
  return remotes;
};

module.exports = { gitListRemoteTags };
