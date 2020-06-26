import { isAnyObject, isPlainObject, isNaNValue } from 'is-what';

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
    if ((config.onlyPlainObjects === false && !isAnyObject(target)) ||
        (config.onlyPlainObjects === true && !isPlainObject(target))) {
        if (target === find || (isNaNValue(target) && isNaNValue(find)))
            return replaceWith;
        return target;
    }
    return Object.entries(target).reduce(function (carry, _a) {
        var key = _a[0], val = _a[1];
        carry[key] = findAndReplace(val, find, replaceWith, config);
        return carry;
    }, {});
}
function _findAndReplaceIf(target, checkFn, propKey) {
    var targetAfterCheck = checkFn(target, propKey);
    if (!isPlainObject(target))
        return targetAfterCheck;
    return Object.entries(targetAfterCheck).reduce(function (carry, _a) {
        var key = _a[0], val = _a[1];
        carry[key] = _findAndReplaceIf(val, checkFn, key);
        return carry;
    }, {});
}
/**
 * Goes through an object recursively and replaces all props with what's is returned in the `checkFn`. Also works on non-objects. `checkFn` is triggered on every single level of any value/object.
 *
 * @export
 * @param {*} target Target can be anything
 * @param {(foundVal: any, propKey: string | undefined) => any} checkFn a function that will receive the `foundVal`
 * @returns {*} the target with replaced values
 */
function findAndReplaceIf(target, checkFn) {
    return _findAndReplaceIf(target, checkFn, undefined);
}

export { _findAndReplaceIf, findAndReplace, findAndReplaceIf };
