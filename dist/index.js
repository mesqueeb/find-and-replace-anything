import { isArray, isAnyObject, isPlainObject, isNaNValue } from 'is-what';

function findAndReplace(target, find, replaceWith, config = { onlyPlainObjects: false, checkArrayValues: false }) {
  const _target = target;
  if (config.checkArrayValues && isArray(_target) && !isAnyObject(_target)) {
    return _target.map((value) => findAndReplace(value, find, replaceWith, config));
  }
  if (!config.onlyPlainObjects && !isAnyObject(_target) || config.onlyPlainObjects === true && !isPlainObject(_target)) {
    if (_target === find || isNaNValue(_target) && isNaNValue(find)) {
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
  if (config.checkArrayValues && isArray(_target) && !isAnyObject(_target)) {
    return _target.map((value) => _findAndReplaceIf(value, checkFn, void 0, config));
  }
  if (!isPlainObject(_target))
    return _target;
  return Object.entries(_target).reduce((carry, [key, val]) => {
    carry[key] = _findAndReplaceIf(val, checkFn, key, config);
    return carry;
  }, {});
}
function findAndReplaceIf(target, checkFn, config = { onlyPlainObjects: true, checkArrayValues: false }) {
  return _findAndReplaceIf(target, checkFn, void 0, config);
}

export { _findAndReplaceIf, findAndReplace, findAndReplaceIf };
