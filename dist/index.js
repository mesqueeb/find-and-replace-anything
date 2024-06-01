import { isAnyObject, isArray, isNaNValue, isPlainObject } from 'is-what';
/**
 * Goes through an object recursively and replaces all occurences of the `find` value with `replaceWith`. Also works no non-objects.
 *
 * @export
 * @param target Target can be anything
 * @param find val to find
 * @param replaceWith val to replace
 * @param [config={onlyPlainObjects: false, checkArrayValues: false}]
 * @returns the target with replaced values
 */
export function findAndReplace(target, find, replaceWith, config = { onlyPlainObjects: false, checkArrayValues: false }) {
    const _target = target;
    // arrays
    if (config.checkArrayValues && isArray(_target) && !isAnyObject(_target)) {
        return _target.map((value) => findAndReplace(value, find, replaceWith, config));
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
export function _findAndReplaceIf(target, checkFn, propKey, config = { onlyPlainObjects: true, checkArrayValues: false }) {
    const _target = checkFn(target, propKey);
    if (config.checkArrayValues && isArray(_target) && !isAnyObject(_target)) {
        return _target.map((value) => _findAndReplaceIf(value, checkFn, undefined, config));
    }
    if (!isPlainObject(_target))
        return _target;
    return Object.entries(_target).reduce((carry, [key, val]) => {
        carry[key] = _findAndReplaceIf(val, checkFn, key, config);
        return carry;
    }, {});
}
/**
 * Goes through an object recursively and replaces all props with what's is returned in the `checkFn`. Also works on non-objects. `checkFn` is triggered on every single level of any value/object.
 *
 * @export
 * @param target Target can be anything
 * @param checkFn a function that will receive the `foundVal`
 * @param [config={onlyPlainObjects: true, checkArrayValues: false}]
 * @returns the target with replaced values
 */
export function findAndReplaceIf(target, checkFn, config = { onlyPlainObjects: true, checkArrayValues: false }) {
    return _findAndReplaceIf(target, checkFn, undefined, config);
}
