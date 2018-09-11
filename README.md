# Find and replace anything 🎣

```
npm i find-and-replace-anything
```

Replace one val with another or all occurrences in an object recursively. A simple & small integration.

It's literally just this:

```js
/**
 * @param {*} target Target can be anything
 * @param {*} find val to find
 * @param {*} replaceWith val to replace
 * @returns the target with replaced values
 */
function findAndReplaceRecursively (target, find, replaceWith) {
  if (!isObject(target)) {
    if (target === find) return replaceWith
    return target
  }
  return Object.keys(target)
    .reduce((carry, key) => {
      const val = target[key]
      carry[key] = findAndReplaceRecursively(val, find, replaceWith)
      return carry
    }, {})
}
```
