'use strict';

const isWhat = require('is-what');

function findAndReplace(target, find, replaceWith, config = { onlyPlainObjects: false, checkArrayValues: false }) {
  const _target = target;
  if (config.checkArrayValues && isWhat.isArray(_target) && !isWhat.isAnyObject(_target)) {
    return _target.map((value) => findAndReplace(value, find, replaceWith, config));
  }
  if (!config.onlyPlainObjects && !isWhat.isAnyObject(_target) || config.onlyPlainObjects === true && !isWhat.isPlainObject(_target)) {
    if (_target === find || isWhat.isNaNValue(_target) && isWhat.isNaNValue(find)) {
      return replaceWith;
    }
    return _target;
  }
  return Object.entries(target).reduce((carry, [key, val]) => {
    carry[key] = findAndReplace(val, find, replaceWith, config);
    return carry;
  }, {});
}
function _findAndReplaceIf(target, checkFn, propKey, config = { onlyPlainObjects: true, checkArrayValues: false }) {
  const _target = checkFn(target, propKey);
  if (config.checkArrayValues && isWhat.isArray(_target) && !isWhat.isAnyObject(_target)) {
    return _target.map((value) => _findAndReplaceIf(value, checkFn, void 0, config));
  }
  if (!isWhat.isPlainObject(_target))
    return _target;
  return Object.entries(_target).reduce((carry, [key, val]) => {
    carry[key] = _findAndReplaceIf(val, checkFn, key, config);
    return carry;
  }, {});
}
function findAndReplaceIf(target, checkFn, config = { onlyPlainObjects: true, checkArrayValues: false }) {
  return _findAndReplaceIf(target, checkFn, void 0, config);
}

exports._findAndReplaceIf = _findAndReplaceIf;
exports.findAndReplace = findAndReplace;
exports.findAndReplaceIf = findAndReplaceIf;
