'use strict';
const deDupeEngineVendors = require('./lib/de-dupe-engine-vendor')
  .deDupeEngineVendor;

module.exports = {
  name: 'ember-cli-lazy-loading-engine-vendor-deduper',
  postBuild: deDupeEngineVendors,
};
