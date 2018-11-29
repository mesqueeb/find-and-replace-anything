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
 * @param {IConfig} [config={onlyPlainObjects: false}]
 * @returns {*} the target with replaced values
 */
function findAndReplace(target, find, replaceWith, config) {
    if (config === void 0) { config = { onlyPlainObjects: false }; }
    if ((config.onlyPlainObjects === false && !isWhat.isAnyObject(target)) ||
        (config.onlyPlainObjects === true && !isWhat.isPlainObject(target))) {
        if (target === find)
            return replaceWith;
        return target;
    }
    return Object.keys(target)
        .reduce(function (carry, key) {
        var val = target[key];
        carry[key] = findAndReplace(val, find, replaceWith, config);
        return carry;
    }, {});
}
/**
 * Goes through an object recursively and replaces all props with what's is returned in the `checkFn`. Also works no non-objects.
 *
 * @export
 * @param {*} target Target can be anything
 * @param {*} checkFn a function that will receive the `foundVal`
 * @returns {*} the target with replaced values
 */
function findAndReplaceIf(target, checkFn) {
    if (!isWhat.isPlainObject(target))
        return checkFn(target);
    return Object.keys(target)
        .reduce(function (carry, key) {
        var val = target[key];
        carry[key] = findAndReplaceIf(val, checkFn);
        return carry;
    }, {});
}

exports.findAndReplace = findAndReplace;
exports.findAndReplaceIf = findAndReplaceIf;
