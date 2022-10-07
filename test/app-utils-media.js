/* eslint-disable no-undef */
const assert = require("assert");
// eslint-disable-next-line no-unused-vars
const should = require("should");

const { getImage } = require("../app/utils/media");

describe("app/utils/media.js", function () {
  describe("getImage()", function () {
    it("non-existed url", async function () {
      const result = await getImage({ imageUrl: "non-existed-url", width: 50, height: 50, fit: "cover" });
      (result === null).should.be.true();
    });
  });
});
