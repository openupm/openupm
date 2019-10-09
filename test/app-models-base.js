/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");
const mockKnex = require("mock-knex");
const tracker = mockKnex.getTracker();

const { ModelBase, registerModel } = require("../app/models/base");

class TempModel extends ModelBase {}

registerModel(TempModel, {
  hasTimestamps: true
});

describe("app/models/base.js", function() {
  beforeEach(function(done) {
    tracker.install();
    done();
  });

  afterEach(function(done) {
    tracker.uninstall();
    done();
  });

  describe("fetchOne", function() {
    it("simple", async function() {
      const result = {
        id: 1,
        name: "name"
      };
      tracker.on("query", query => {
        query.response(result);
      });
      let obj = await TempModel.fetchOne(1);
      Object.assign({}, obj).should.deepEqual(result);
    });
    it("not found", async function() {
      const result = null;
      tracker.on("query", query => {
        query.response(result);
      });
      let obj = await TempModel.fetchOne(1);
      (obj === null).should.be.true();
    });
  });

  describe("fetchOneOrThrow", function() {
    it("simple", async function() {
      const result = {
        id: 1,
        name: "name"
      };
      tracker.on("query", query => {
        query.response(result);
      });
      let obj = await TempModel.fetchOneOrThrow(1);
      Object.assign({}, obj).should.deepEqual(result);
    });
    it("not found", async function() {
      const result = null;
      tracker.on("query", query => {
        query.response(result);
      });
      TempModel.fetchOneOrThrow(1).should.be.rejected();
    });
  });

  describe("fetchAll", function() {
    it("simple", async function() {
      const results = [
        {
          id: 1,
          name: "name 1"
        },
        {
          id: 2,
          name: "name 2"
        }
      ];
      tracker.on("query", query => {
        query.response(results);
      });
      let objs = await TempModel.fetchAll();
      // Compare pure objects.
      objs.map(x => Object.assign({}, x)).should.deepEqual(results);
    });
  });

  describe("create", function() {
    it("simple", async function() {
      tracker.on("query", function sendResult(query, step) {
        [
          function firstQuery() {
            query.response([1]);
          },
          function secondQuery() {
            query.response({ id: 1, name: "name 1" });
          }
        ][step - 1]();
      });
      let obj = await TempModel.create({ name: "name 1" });
      Object.assign({}, obj).should.deepEqual({ id: 1, name: "name 1" });
    });
  });

  describe("update", function() {
    it("simple", async function() {
      tracker.on("query", function sendResult(query, step) {
        [
          () => query.response({ id: 1, name: "name" }),
          () => query.response(null)
        ][step - 1]();
      });
      let obj = await TempModel.fetchOne(1);
      Object.assign({}, obj).should.deepEqual({ id: 1, name: "name" });
      await obj.update({ name: "another name" });
      obj.id.should.equal(1);
      obj.name.should.equal("another name");
      ("updatedAt" in obj).should.be.true();
    });
  });
});
