import { isAnyObject, isPlainObject } from 'is-what'

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
  config: IConfig = {onlyPlainObjects: false}
): any {
  if (
    (config.onlyPlainObjects === false && !isAnyObject(target)) ||
    (config.onlyPlainObjects === true && !isPlainObject(target))
  ) {
    if (target === find) return replaceWith
    return target
  }
  return Object.keys(target)
    .reduce((carry, key) => {
      const val = target[key]
      carry[key] = findAndReplace(val, find, replaceWith, config)
      return carry
    }, {})
}

/**
 * Goes through an object recursively and replaces all props with what's is returned in the `checkFn`. Also works no non-objects.
 *
 * @export
 * @param {*} target Target can be anything
 * @param {*} checkFn a function that will receive the `foundVal`
 * @returns {*} the target with replaced values
 */
export function findAndReplaceIf (
  target: any,
  checkFn: (foundVal: any) => any,
): any {
  if (!isPlainObject(target)) return checkFn(target)
  return Object.keys(target)
    .reduce((carry, key) => {
      const val = target[key]
      carry[key] = findAndReplaceIf(val, checkFn)
      return carry
    }, {})
}
