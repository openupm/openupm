/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");
const request = require("supertest");
const _ = require("lodash");

const { app } = require("../app");
const redis = require("../app/db/redis");
const Release = require("../app/models/release");

const releases = [
  {
    version: "0.1.0",
    commit: "0000001",
    tag: "v0.1.0",
    state: 2,
    buildId: "10",
    reason: 0
  },
  {
    version: "0.2.0",
    commit: "0000002",
    tag: "v0.2.0",
    state: 2,
    buildId: "16",
    reason: 0
  }
];

describe("app/views/packagesView.js", function() {
  beforeEach(async function() {
    for (const release of releases) {
      await Release.save({
        packageName: "sample-package",
        ...release
      });
    }
  });
  afterEach(async function() {
    await redis.client.del("rel:sample-package");
  });
  after(function(done) {
    redis.close();
    done();
  });

  describe("/packages/:name", function() {
    it("simple", function(done) {
      request(app)
        .get("/packages/sample-package")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.releases
            .map(x => _.omit(x, ["updatedAt"]))
            .should.deepEqual([releases[1], releases[0]]);
          done();
        });
    });
    it("package-not-exist", function(done) {
      request(app)
        .get("/packages/package-not-exist")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.releases.should.deepEqual([]);
          done();
        });
    });
  });
});
