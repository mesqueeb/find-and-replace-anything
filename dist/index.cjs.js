'use strict';

var isWhat = require('is-what');

/**
 * Goes through an object recursively and replaces all occurences of the `find` value with `replaceWith`. Also works no non-objects.
 *
 * @export
 * @param {*} target Target can be anything
 * @param {*} find val to find
 * @param {*} replaceWith val to replace
 * @returns the target with replaced values
 */
function findAndReplaceRecursively(target, find, replaceWith) {
    if (!isWhat.isObject(target)) {
        if (target === find)
            return replaceWith;
        return target;
    }
    return Object.keys(target)
        .reduce(function (carry, key) {
        var val = target[key];
        carry[key] = findAndReplaceRecursively(val, find, replaceWith);
        return carry;
    }, {});
}

module.exports = findAndReplaceRecursively;
