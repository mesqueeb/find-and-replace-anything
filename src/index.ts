import { isAnyObject, isPlainObject, isNaNValue, isArray } from 'is-what'

type Config = {
  onlyPlainObjects?: boolean
  checkArrayValues?: boolean
}

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
export function findAndReplace (
  target: any,
  find: any,
  replaceWith: any,
  config: Config = { onlyPlainObjects: false, checkArrayValues: false }
): any {
  const _target = target
  // arrays
  if (config.checkArrayValues && isArray(_target) && !isAnyObject(_target)) {
    return (_target as any[]).map(value => findAndReplace(value, find, replaceWith, config))
  }
  // non-objects
  if (
    (!config.onlyPlainObjects && !isAnyObject(_target)) ||
    (config.onlyPlainObjects === true && !isPlainObject(_target))
  ) {
    if (_target === find || (isNaNValue(_target) && isNaNValue(find))) {
      return replaceWith
    }
    return _target
  }
  // objects
  return Object.entries(target).reduce((carry, [key, val]) => {
    carry[key] = findAndReplace(val, find, replaceWith, config)
    return carry
  }, {})
}

export function _findAndReplaceIf (
  target: any,
  checkFn: (foundVal: any, propKey: string | undefined) => any,
  propKey: string | undefined,
  config: Config = { onlyPlainObjects: true, checkArrayValues: false }
): any {
  const _target = checkFn(target, propKey)
  if (config.checkArrayValues && isArray(_target) && !isAnyObject(_target)) {
    return (_target as any[]).map(value => _findAndReplaceIf(value, checkFn, undefined, config))
  }
  if (!isPlainObject(_target)) return _target
  return Object.entries(_target).reduce((carry, [key, val]) => {
    carry[key] = _findAndReplaceIf(val, checkFn, key, config)
    return carry
  }, {})
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
export function findAndReplaceIf (
  target: any,
  checkFn: (foundVal: any, propKey: string | undefined) => any,
  config: Config = { onlyPlainObjects: true, checkArrayValues: false }
): any {
  return _findAndReplaceIf(target, checkFn, undefined, config)
}
