'use strict';
const fs = require('fs');
const path = require('path');
const j = require('jscodeshift');
const glob = require('glob');

function findDefineBlocks(path) {
  const expression = path.node.expression;
  return (
    expression.type === 'CallExpression' &&
    expression.callee.type === 'Identifier' &&
    expression.callee.name === 'define'
  );
}

function deDupeEngineVendor(result) {
  const dir = result.directory;
  const vendorjs = path.join(dir, 'assets', 'vendor.js');
  const output = fs.readFileSync(vendorjs, 'utf-8');

  const vendorModules = j(output)
    .find(j.ExpressionStatement)
    .filter(findDefineBlocks)
    .nodes()
    .map(node => node.expression.arguments[0].value);

  glob
    .sync(`${dir}/engines-dist/*/assets/engine-vendor.js`)
    .forEach(engineVendor => {
      const engineVendorSrc = fs.readFileSync(engineVendor, 'utf-8');

      const deDupedCode = j(engineVendorSrc)
        .find(j.ExpressionStatement)
        .filter(findDefineBlocks)
        .forEach(path => {
          const moduleName = path.node.expression.arguments[0].value;
          if (vendorModules.includes(moduleName)) {
            j(path).remove();
          }
        })
        .toSource();

      fs.writeFileSync(engineVendor, deDupedCode);
    });
}

module.exports = {
  findDefineBlocks,
  deDupeEngineVendor,
};
