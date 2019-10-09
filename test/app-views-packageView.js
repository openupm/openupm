/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");
const request = require("supertest");
const mockKnex = require("mock-knex");
const tracker = mockKnex.getTracker();

const { app } = require("../app");

describe("app/views/packageView.js", function() {
  beforeEach(function(done) {
    tracker.install();
    done();
  });

  afterEach(function(done) {
    tracker.uninstall();
    done();
  });

  describe("/package/:name", function() {
    it("simple", function(done) {
      const results = [
        {
          version: "0.1.0",
          commit: "0000001",
          tag: "v0.1.0",
          state: 2,
          buildId: "10",
          reason: 0
        }
      ];
      tracker.on("query", query => {
        query.response(results);
      });
      request(app)
        .get("/package/the-package-name")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.releases.should.deepEqual(results);
          done();
        });
    });
    it("sorted", function(done) {
      const results = [
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
      tracker.on("query", query => {
        query.response(results);
      });
      request(app)
        .get("/package/the-package-name")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.releases.should.deepEqual([results[1], results[0]]);
          done();
        });
    });
    it("package-not-exist", function(done) {
      const results = [];
      tracker.on("query", query => {
        query.response(results);
      });
      request(app)
        .get("/package/package-not-exist")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.releases.should.deepEqual(results);
          done();
        });
    });
  });
});
