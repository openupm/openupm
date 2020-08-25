/**
 * Fetch site info
 **/
const config = require("config");
const urljoin = require("url-join");
const SiteInfo = require("../models/siteInfo");
const { AxiosService, httpErrorInfo } = require("../utils/http");
const logger = require("../utils/log")(module);

/**
 * Fetch site info.
 */
const fetchSiteInfo = async function() {
  logger.info("fetchSiteInfo");
  await _fetchStars("openupm/openupm");
};

/**
 * Fetch repository stars.
 * @param {string} repo
 */
const _fetchStars = async function(repo) {
  try {
    const headers = { Accept: "application/vnd.github.v3.json" };
    if (config.gitHub.token)
      headers.authorization = `Bearer ${config.gitHub.token}`;
    const resp = await AxiosService.create().get(
      urljoin("https://api.github.com/repos/", repo),
      { headers }
    );
    const repoInfo = resp.data;
    const stars = repoInfo.stargazers_count || 0;
    await SiteInfo.setStars(stars);
  } catch (error) {
    logger.error(httpErrorInfo(error, {}), "fetch stars error");
  }
};

if (require.main === module) {
  let program = require("../utils/commander");
  let packageNames = null;
  program.parse(process.argv).run(async function() {
    await fetchSiteInfo(packageNames);
  });
}
