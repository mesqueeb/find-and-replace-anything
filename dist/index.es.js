import { isArray, isAnyObject, isPlainObject, isNaNValue } from 'is-what';

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
function findAndReplace(target, find, replaceWith, config = { onlyPlainObjects: false, checkArrayValues: false }) {
    const _target = target;
    // arrays
    if (config.checkArrayValues && isArray(_target) && !isAnyObject(_target)) {
        return _target.map(value => findAndReplace(value, find, replaceWith, config));
    }
    // non-objects
    if ((!config.onlyPlainObjects && !isAnyObject(_target)) ||
        (config.onlyPlainObjects === true && !isPlainObject(_target))) {
        if (_target === find || (isNaNValue(_target) && isNaNValue(find))) {
            return replaceWith;
        }
        return _target;
    }
    // objects
    return Object.entries(target).reduce((carry, [key, val]) => {
        carry[key] = findAndReplace(val, find, replaceWith, config);
        return carry;
    }, {});
}
function _findAndReplaceIf(target, mainObject, checkFn, propKey, propPath, config = { onlyPlainObjects: true, checkArrayValues: false }) {
    const _target = checkFn(target, propKey, propPath, mainObject);
    if (config.checkArrayValues && isArray(_target) && !isAnyObject(_target)) {
        return _target.map((value, index) => {
            const ppath = propPath !== undefined ? [propPath, index].join('.') : String(index);
            return _findAndReplaceIf(value, mainObject, checkFn, undefined, ppath, config);
        });
    }
    if (!isPlainObject(_target))
        return _target;
    return Object.entries(_target).reduce((carry, [key, val]) => {
        const ppath = propPath !== undefined ? [propPath, key].join('.') : key;
        carry[key] = _findAndReplaceIf(val, mainObject, checkFn, key, ppath, config);
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
function findAndReplaceIf(target, checkFn, config = { onlyPlainObjects: true, checkArrayValues: false }) {
    return _findAndReplaceIf(target, target, checkFn, undefined, undefined, config);
}

export { _findAndReplaceIf, findAndReplace, findAndReplaceIf };
