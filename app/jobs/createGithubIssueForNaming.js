/**
 * Create GitHub issues for package naming.
 **/

const nunjucks = require("nunjucks");

const { loadPackage } = require("../utils/package");
const {
  createIssue,
  updateIssue,
  loadIssueTemplate
} = require("../utils/githubRest");
const logger = require("../utils/log")(module);

const createOrUpdateGithubIssueForNaming = async function(name, issueNumber) {
  // Load package yaml file.
  logger.debug({ pkg: name }, "load yaml file");
  const pkg = await loadPackage(name);
  const [repoOwner, repoName] = pkg.repo.split("/");
  const { data, content, errors } = loadIssueTemplate(
    "package_renaming_request.md"
  );
  if (errors.length) {
    logger.error({ errors }, "issue template parsing error");
    return;
  }
  const issueName = data.name;
  nunjucks.configure({ autoescape: false });
  const issueBody = nunjucks.renderString(content, { pkg, name });
  let result = null;
  if (issueNumber)
    result = await updateIssue(
      repoOwner,
      repoName,
      issueNumber,
      issueName,
      issueBody
    );
  else result = await createIssue(repoOwner, repoName, issueName, issueBody);
  console.log(name);
  console.log(result.html_url);
};

if (require.main === module) {
  const program = require("../utils/commander");
  let packageName = null;
  let issueNumber = null;
  program
    .arguments("<name> [issueno]")
    .action((name, issueno) => {
      packageName = name;
      issueNumber = issueno;
    })
    .parse(process.argv)
    .requiredArgs(1)
    .run(createOrUpdateGithubIssueForNaming, packageName, issueNumber);
}
