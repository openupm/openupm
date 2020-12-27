/**
 * GitHub GraphQL rest API
 */
const fs = require("fs");
const config = require("config");
const path = require("path");
const urljoin = require("url-join");
const frontmatter = require("@github-docs/frontmatter");

const logger = require("./log")(module);
const { AxiosService, CancelToken, httpErrorInfo } = require("./http");

// Create a GitHub issue.
const createIssue = async function(repoOwner, repoName, issueTitle, issueBody) {
  try {
    const headers = { Accept: "application/vnd.github.v3.json" };
    if (config.gitHub.issueToken)
      headers.authorization = `Bearer ${config.gitHub.issueToken}`;
    else throw new Error("error empty issueToken");
    let resp = null;
    const source = CancelToken.source();
    setTimeout(() => {
      if (resp === null) source.cancel("ECONNTIMEOUT");
    }, 10000);
    const url = urljoin(
      "https://api.github.com/repos/",
      repoOwner,
      repoName,
      "issues"
    );
    const postData = {
      title: issueTitle,
      body: issueBody
    };
    resp = await AxiosService.create().post(url, postData, {
      headers,
      cancelToken: source.token
    });
    const result = resp.data;
    return result;
  } catch (error) {
    logger.error(httpErrorInfo(error, {}), "error");
  }
};

// Update a GitHub issue.
const updateIssue = async function(
  repoOwner,
  repoName,
  issueNumber,
  issueTitle,
  issueBody
) {
  try {
    const headers = { Accept: "application/vnd.github.v3.json" };
    if (config.gitHub.issueToken)
      headers.authorization = `Bearer ${config.gitHub.issueToken}`;
    else throw new Error("error empty issueToken");
    let resp = null;
    const source = CancelToken.source();
    setTimeout(() => {
      if (resp === null) source.cancel("ECONNTIMEOUT");
    }, 10000);
    const url = urljoin(
      "https://api.github.com/repos/",
      repoOwner,
      repoName,
      "issues",
      issueNumber
    );
    const postData = {
      title: issueTitle,
      body: issueBody
    };
    resp = await AxiosService.create().patch(url, postData, {
      headers,
      cancelToken: source.token
    });
    const result = resp.data;
    return result;
  } catch (error) {
    logger.error(httpErrorInfo(error, {}), "error");
  }
};

// Load issue template by name.
const loadIssueTemplate = function(name) {
  const issueTemplateDir = path.resolve(
    __dirname,
    "../../.github/INTERNAL_ISSUE_TEMPLATE"
  );
  let absPath = path.resolve(issueTemplateDir, name);
  const text = fs.readFileSync(absPath, "utf8");
  const data = frontmatter(text);
  return data;
};

module.exports = {
  createIssue,
  updateIssue,
  loadIssueTemplate
};
