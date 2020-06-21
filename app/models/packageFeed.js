/* Store feed data to Redis.
 *
 *   feed:$feedName:$format
 *     feed content
 */

const { orderBy } = require("lodash/collection");
const config = require("config");
const { Feed } = require("feed");
const redis = require("../db/redis");

const feedRecentUpdateKey = "feed:update:";

/**
 * Set aggregated extra data.
 * @param {Array} objs
 * [{
 *   packageName: str,
 *   displayName: str,
 *   time: int,
 *   version: str,
 *   author: [
 *     {
 *       name: str,
 *       link: str
 *     }, ...]
 *   }, ...]
 */
const setFeedRecentUpdate = async function(objs) {
  // Sort by time.
  objs = orderBy(objs, ["time"], ["desc"]);
  // Generate the feed.
  const feed = new Feed({
    title: "OpenUPM Recent Updates",
    description: "Feed of OpenUPM Recently Updated Packages",
    id: "https://openupm.com/",
    link: "https://openupm.com/",
    language: "en",
    image: "https://openupm.com/images/openupm-icon-256.png",
    copyright: "Copyright @ 2019 Favo Yang",
    feedLinks: {
      rss: "https://openupm.com/feeds/updates/rss",
      json: "https://openupm.com/feeds/updates/json",
      atom: "https://openupm.com/feeds/updates/atom"
    },
    author: {
      name: "OpenUPM",
      email: "hello@openupm.com",
      link: "https://openupm.com"
    }
  });
  const limit = Math.min(objs.length, config.feeds.recentUpdateCount);
  for (let i = 0; i < limit; i++) {
    const obj = objs[i];
    const guid = `${obj.packageName}@${obj.version}`;
    const url = `https://openupm.com/packages/${obj.packageName}`;
    const title = `${obj.displayName} v${obj.version} release`;
    const description = `Package ${obj.packageName} v${obj.version} is released.`;
    const date = new Date(obj.time);
    feed.addItem({
      title,
      id: guid,
      link: url,
      description,
      content: description,
      date,
      author: obj.author,
      image: obj.image
    });
  }
  // Save for formats.
  const rss2 = feed.rss2();
  await redis.client.set(feedRecentUpdateKey + "rss2", rss2);
  const atom1 = feed.atom1();
  await redis.client.set(feedRecentUpdateKey + "atom1", atom1);
  const json1 = feed.json1();
  await redis.client.set(feedRecentUpdateKey + "json1", json1);
};

/**
 * Get aggregated extra data.
 */
const getFeedRecentUpdate = async function(format) {
  const text = await redis.client.get(feedRecentUpdateKey + format);
  return text;
};

module.exports = {
  getFeedRecentUpdate,
  setFeedRecentUpdate
};
