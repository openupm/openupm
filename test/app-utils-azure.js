/* Tests for app/utils/azure.js */

/* eslint-disable no-undef */
const {
  getBuildLogsUrl,
  getBuildSectionLogUrl
} = require("../app/utils/azure");

describe("app/utils/azure.js", function() {
  describe("getBuildLogsUrl", function() {
    it("getBuildLogsUrl", function() {
      const url = getBuildLogsUrl(10025);
      url.should.endWith("_apis/build/builds/10025/logs");
    });
  });
  describe("getBuildSectionLogUrl", function() {
    it("getBuildSectionLogUrl", function() {
      const url = getBuildSectionLogUrl(10025, 14);
      url.should.endWith("_apis/build/builds/10025/logs/14");
    });
  });
});
