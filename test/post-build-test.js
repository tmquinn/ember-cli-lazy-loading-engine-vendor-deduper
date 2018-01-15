const fs = require('fs');
const path = require('path');
const assert = require('assert');
const {
  getModuleNames,
  deDupeEngineVendor,
} = require('../lib/de-dupe-engine-vendor');

describe('Post Build tests', function() {
  describe('Basic', function() {
    it('runs the test', function() {
      assert.ok(true);
    });
  });

  describe('Unit tests', function() {
    const output = fs.readFileSync(
      path.join(process.cwd(), 'test-fixtures', 'one.js'),
      'utf-8'
    );

    it('getModuleNames can determine modules', function() {
      const results = ['foo/bar', 'foo/bar/baz', 'herp/derp', 'la/de/da'];
      assert.deepEqual(getModuleNames(output), results);
    });

    it('deDupeEngineVendor can de-dupe modules', function() {
      const vendorModules = ['foo/bar/baz', 'la/de/da'];
      const expected = `define('foo/bar', function() {});
define('herp/derp', function() {});`;
      assert.equal(deDupeEngineVendor(output, vendorModules), expected);
    });
  });

  describe('Acceptance test', function() {});
});
