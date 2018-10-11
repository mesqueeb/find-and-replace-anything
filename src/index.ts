import { isAnyObject, isObject } from 'is-what'

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
function findAndReplaceRecursively (
  target: any,
  find: any,
  replaceWith: any,
  config: IConfig = {onlyPlainObjects: false}
): any {
  if (
    (config.onlyPlainObjects === false && !isAnyObject(target)) ||
    (config.onlyPlainObjects === true && !isObject(target))
  ) {
    if (target === find) return replaceWith
    return target
  }
  return Object.keys(target)
    .reduce((carry, key) => {
      const val = target[key]
      carry[key] = findAndReplaceRecursively(val, find, replaceWith, config)
      return carry
    }, {})
}

export default findAndReplaceRecursively
