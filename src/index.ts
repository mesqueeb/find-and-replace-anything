import { isAnyObject, isPlainObject, isNaNValue } from 'is-what'

type IConfig = {
  onlyPlainObjects: boolean
}

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
export function findAndReplace (
  target: any,
  find: any,
  replaceWith: any,
  config: IConfig = { onlyPlainObjects: false }
): any {
  if (
    (config.onlyPlainObjects === false && !isAnyObject(target)) ||
    (config.onlyPlainObjects === true && !isPlainObject(target))
  ) {
    if (target === find || (isNaNValue(target) && isNaNValue(find))) return replaceWith
    return target
  }
  return Object.entries(target).reduce((carry, [key, val]) => {
    carry[key] = findAndReplace(val, find, replaceWith, config)
    return carry
  }, {})
}

export function _findAndReplaceIf (
  target: any,
  checkFn: (foundVal: any, propKey: string | undefined) => any,
  propKey: string | undefined
): any {
  const targetAfterCheck = checkFn(target, propKey)
  if (!isPlainObject(target)) return targetAfterCheck
  return Object.entries(targetAfterCheck).reduce((carry, [key, val]) => {
    carry[key] = _findAndReplaceIf(val, checkFn, key)
    return carry
  }, {})
}

/**
 * Goes through an object recursively and replaces all props with what's is returned in the `checkFn`. Also works on non-objects. `checkFn` is triggered on every single level of any value/object.
 *
 * @export
 * @param {*} target Target can be anything
 * @param {(foundVal: any, propKey: string | undefined) => any} checkFn a function that will receive the `foundVal`
 * @returns {*} the target with replaced values
 */
export function findAndReplaceIf (
  target: any,
  checkFn: (foundVal: any, propKey: string | undefined) => any
): any {
  return _findAndReplaceIf(target, checkFn, undefined)
}
