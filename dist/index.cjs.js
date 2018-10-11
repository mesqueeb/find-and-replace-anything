'use strict';

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
function findAndReplaceRecursively(target, find, replaceWith, config) {
    if (config === void 0) { config = { onlyPlainObjects: false }; }
    if ((config.onlyPlainObjects === false && !isWhat.isAnyObject(target)) ||
        (config.onlyPlainObjects === true && !isWhat.isObject(target))) {
        if (target === find)
            return replaceWith;
        return target;
    }
    return Object.keys(target)
        .reduce(function (carry, key) {
        var val = target[key];
        carry[key] = findAndReplaceRecursively(val, find, replaceWith, config);
        return carry;
    }, {});
}

module.exports = findAndReplaceRecursively;
