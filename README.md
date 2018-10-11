# Find and replace anything 🎣

```
npm i find-and-replace-anything
```

Replace one val with another or all occurrences in an object recursively. A simple & small integration.

## Usage

This will find a value inside an object and replace it with another:

- `findAndReplace(object, find, replace)`

```js
import findAndReplace from 'find-and-replace-anything'

findAndReplace({_1: {_2: {_3: 'a'}}}, 'a', 'b')
  // returns
  {_1: {_2: {_3: 'b'}}}

findAndReplace('works on "exact" strings as well', 'a', 'b')
  // returns
  'works on "exact" strings as well'

findAndReplace('a', 'a', 'b')
  // returns
  'b'

// works with other types as well:
findAndReplace({nr: 1}, 1, 100)
  // returns
  {nr: 100}
```

## A note on plain objects vs classes

Please note that it will also recursively look inside special objects like JavaScript classes etc. So make sure you test the behaviour properly in those cases! (especially when your classes have read-only properties etc.)

```js
class MyClass {
  constructor () {
    this.prop = 1
  }
}
const target = {
  prop: 1,
  class: new MyClass()
}
findAndReplace(target, 1, 2)
  // this will replace 1 with 2 in the class as well and returns:
  {prop: 2, class: {prop: 2}}
```

If you need it to only recursively go through plain JavaScript object and avoid going in custom classes etc. you can pass a 4th parameter like so:

```js
findAndReplace(target, 1, 2, {onlyPlainObjects: true})
  // this will replace 1 with 2 only in the plain object and returns:
  {prop: 2, class: {prop: 1}}
```

> Also be careful with circular references! It will cause this library to crash.

## Source code

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
