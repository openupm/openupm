const assert = require('assert');

const { getVersionFromTag } = require('../app/utils/semver');

describe('app/util/semver.js', function () {
  describe('getVersionFromTag()', function () {
    it('test a.b.c', function () {
      assert.equal(getVersionFromTag('v1.0.0'), '1.0.0');
    });
    it('test va.b.c', function () {
      assert.equal(getVersionFromTag('v1.0.0'), '1.0.0');
    });
    it('test a.b.c-preview', function () {
      assert.equal(getVersionFromTag('1.0.0-preview'), '1.0.0-preview');
    });
    it('test va.b.c-preview', function () {
      assert.equal(getVersionFromTag('v1.0.0-preview'), '1.0.0-preview');
    });
    it('test a.b.c.d', function () {
      assert.equal(getVersionFromTag('1.0.0.0'), '1.0.0.0');
    });
    it('test va.b.c.d', function () {
      assert.equal(getVersionFromTag('v1.0.0.0'), '1.0.0.0');
    });
    it('test a.b.c-preview.d', function () {
      assert.equal(getVersionFromTag('1.0.0-preview.0'), '1.0.0-preview.0');
    });
    it('test va.b.c-preview.d', function () {
      assert.equal(getVersionFromTag('v1.0.0-preview.0'), '1.0.0-preview.0');
    });
  });
});