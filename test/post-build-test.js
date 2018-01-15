const path = require('path');
const assert = require('assert');
const deDupeEngineVendor = require('../lib/de-dupe-engine-vendor')
  .deDupeEngineVendor;

function runScenario(scenario) {
  const scenarioPath = path.join(
    process.cwd(),
    'test-fixtures',
    scenario,
    'dist'
  );

  console.log(scenarioPath);
}

describe('Post Build tests', function() {
  it('runs the test', function() {
    assert.ok(true);
  });

  it('Passes Scenario One', function() {
    runScenario('one');
  });
});
