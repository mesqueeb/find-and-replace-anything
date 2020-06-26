'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isWhat = require('is-what');

/**
 * Goes through an object recursively and replaces all occurences of the `find` value with `replaceWith`. Also works no non-objects.
 *
 * @export
 * @param {*} target Target can be anything
 * @param {*} find val to find
 * @param {*} replaceWith val to replace
 * @param {Config} [config={onlyPlainObjects: false, checkArrayValues: false}]
 * @returns {*} the target with replaced values
 */
function findAndReplace(target, find, replaceWith, config) {
    if (config === void 0) { config = { onlyPlainObjects: false, checkArrayValues: false }; }
    var _target = target;
    // arrays
    if (config.checkArrayValues && isWhat.isArray(_target) && !isWhat.isAnyObject(_target)) {
        return _target.map(function (value) { return findAndReplace(value, find, replaceWith, config); });
    }
    // non-objects
    if ((!config.onlyPlainObjects && !isWhat.isAnyObject(_target)) ||
        (config.onlyPlainObjects === true && !isWhat.isPlainObject(_target))) {
        if (_target === find || (isWhat.isNaNValue(_target) && isWhat.isNaNValue(find))) {
            return replaceWith;
        }
        return _target;
    }
    // objects
    return Object.entries(target).reduce(function (carry, _a) {
        var key = _a[0], val = _a[1];
        carry[key] = findAndReplace(val, find, replaceWith, config);
        return carry;
    }, {});
}
function _findAndReplaceIf(target, checkFn, propKey, config) {
    if (config === void 0) { config = { onlyPlainObjects: true, checkArrayValues: false }; }
    var _target = checkFn(target, propKey);
    if (config.checkArrayValues && isWhat.isArray(_target) && !isWhat.isAnyObject(_target)) {
        return _target.map(function (value) { return _findAndReplaceIf(value, checkFn, undefined, config); });
    }
    if (!isWhat.isPlainObject(_target))
        return _target;
    return Object.entries(_target).reduce(function (carry, _a) {
        var key = _a[0], val = _a[1];
        carry[key] = _findAndReplaceIf(val, checkFn, key, config);
        return carry;
    }, {});
}
/**
 * Goes through an object recursively and replaces all props with what's is returned in the `checkFn`. Also works on non-objects. `checkFn` is triggered on every single level of any value/object.
 *
 * @export
 * @param {*} target Target can be anything
 * @param {(foundVal: any, propKey: string | undefined) => any} checkFn a function that will receive the `foundVal`
 * @param {Config} [config={onlyPlainObjects: true, checkArrayValues: false}]
 * @returns {*} the target with replaced values
 */
function findAndReplaceIf(target, checkFn, config) {
    if (config === void 0) { config = { onlyPlainObjects: true, checkArrayValues: false }; }
    return _findAndReplaceIf(target, checkFn, undefined, config);
}

exports._findAndReplaceIf = _findAndReplaceIf;
exports.findAndReplace = findAndReplace;
exports.findAndReplaceIf = findAndReplaceIf;
