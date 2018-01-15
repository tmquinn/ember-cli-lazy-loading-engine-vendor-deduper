'use strict';
const fs = require('fs');
const path = require('path');
const j = require('jscodeshift');
const glob = require('glob');

function filterDefineBlocks(path) {
  const expression = path.node.expression;

  return (
    expression.type === 'CallExpression' &&
    expression.callee.type === 'Identifier' &&
    expression.callee.name === 'define'
  );
}

function getModuleNames(output) {
  return j(output)
    .find(j.ExpressionStatement)
    .filter(filterDefineBlocks)
    .nodes()
    .map(node => node.expression.arguments[0].value);
}

function deDupeEngineVendor(engineVendor, vendorModules) {
  return j(engineVendor)
    .find(j.ExpressionStatement)
    .filter(filterDefineBlocks)
    .forEach(path => {
      const moduleName = path.node.expression.arguments[0].value;
      if (vendorModules.includes(moduleName)) {
        j(path).remove();
      }
    })
    .toSource();
}

function postBuild(result) {
  const dir = result.directory;
  const vendorjs = path.join(dir, 'assets', 'vendor.js');
  const output = fs.readFileSync(vendorjs, 'utf-8');

  const vendorModules = getModuleNames(output);

  glob
    .sync(`${dir}/engines-dist/*/assets/engine-vendor.js`)
    .forEach(engineVendor => {
      fs.writeFileSync(
        engineVendor,
        deDupeEngineVendor(
          fs.readFileSync(engineVendor, 'utf-8'),
          vendorModules
        )
      );
    });
}

module.exports = {
  getModuleNames,
  deDupeEngineVendor,
  postBuild,
};
