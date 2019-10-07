/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");
const request = require("supertest");

const { app } = require("../app");

describe("app/index.js", function() {
  describe("root", function() {
    it("simple", function(done) {
      request(app)
        .get("/")
        .expect(200)
        .end(function(err, res) {
          done(err);
        });
    });
  });
});
