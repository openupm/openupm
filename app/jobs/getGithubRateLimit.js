/**
 * Get GitHub rate limit
 **/

const logger = require("../utils/log")(module);
const { AxiosService, CancelToken, httpErrorInfo } = require("../utils/http");
const { getGithubToken } = require("../utils/github");

const getGithubRateLimit = async function() {
  try {
    const headers = { Accept: "application/vnd.github.v3.json" };
    const githubToken = getGithubToken();
    if (githubToken) headers.authorization = `Bearer ${githubToken}`;
    let resp = null;
    const source = CancelToken.source();
    setTimeout(() => {
      if (resp === null) source.cancel("ECONNTIMEOUT");
    }, 10000);
    resp = await AxiosService.create().get(
      "https://api.github.com/rate_limit",
      { headers, cancelToken: source.token }
    );
    const result = resp.data;
    return result;
  } catch (error) {
    logger.error(httpErrorInfo(error, {}), "error");
  }
};

if (require.main === module) {
  let program = require("../utils/commander");
  program.parse(process.argv).run(async function() {
    const result = await getGithubRateLimit();
    if (result) console.log(result);
  });
}
