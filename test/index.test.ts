import { test, expect } from 'vitest'
import { findAndReplace, findAndReplaceIf } from '../src/index'
import { isPlainObject } from 'is-what'

test('findAndReplace in arrays', () => {
  const res = findAndReplace({ a: [{ b: 'c' }] }, 'c', 'd', { checkArrayValues: true })
  t.deepEqual(res, {
    a: [{ b: 'd' }],
  })
})

test('findAndReplaceIf in arrays', () => {
  const replacer = foundVal => (foundVal === 'c' ? 'd' : foundVal)
  t.deepEqual(findAndReplaceIf({ a: ['c'] }, replacer, { checkArrayValues: true }), {
    a: ['d'],
  })
})

test('findAndReplaceIf in arrays double nested', () => {
  const replacer = foundVal => (foundVal === 'c' ? 'd' : foundVal)
  t.deepEqual(findAndReplaceIf({ a: [{ b: 'c' }, 'c'] }, replacer, { checkArrayValues: true }), {
    a: [{ b: 'd' }, 'd'],
  })
})

test('findAndReplace nested strings', () => {
  t.deepEqual(findAndReplace({ a: { b: { c: 'a' } } }, 'a', 'b'), { a: { b: { c: 'b' } } })
})

test('findAndReplace strings', () => {
  expect(findAndReplace('a', 'a', 'b')).toEqual('b')
  expect(findAndReplace('_', 'a', 'b')).toEqual('_')
})

test('findAndReplace undefined', () => {
  t.deepEqual(findAndReplace({ undefined: undefined }, undefined, 'undefined'), {
    undefined: 'undefined',
  })
})
test('findAndReplace NaN', () => {
  t.deepEqual(findAndReplace({ NaN: NaN }, NaN, 'NaN'), { NaN: 'NaN' })
})
test('findAndReplace null', () => {
  t.deepEqual(findAndReplace({ null: null }, null, 'null'), { null: 'null' })
})

test('findAndReplace does not modify objects', () => {
  let res, ori
  ori = { a: { b: { c: 'a' }, d: 1 } }
  res = findAndReplace(ori, 'a', 'b')
  t.deepEqual(res, { a: { b: { c: 'b' }, d: 1 } })
  t.deepEqual(ori, { a: { b: { c: 'a' }, d: 1 } })
  res.a.b = 1
  t.deepEqual(res, { a: { b: 1, d: 1 } })
  t.deepEqual(ori, { a: { b: { c: 'a' }, d: 1 } })
  res.a.d = 2
  t.deepEqual(res, { a: { b: 1, d: 2 } })
  t.deepEqual(ori, { a: { b: { c: 'a' }, d: 1 } })
  ori.a.d = 3
  t.deepEqual(res, { a: { b: 1, d: 2 } })
  t.deepEqual(ori, { a: { b: { c: 'a' }, d: 3 } })
})

test('findAndReplace does not work with objects', () => {
  let res, ori
  ori = { a: { b: { c: 'a' } } }
  res = findAndReplace(ori, { c: 'a' }, { c: 'b' })
  t.deepEqual(res, { a: { b: { c: 'a' } } })
  t.deepEqual(ori, { a: { b: { c: 'a' } } })
})

test('findAndReplaceIf', () => {
  let res
  function checkFn (foundVal) {
    if (foundVal === 'a') return 'b'
    return foundVal
  }
  res = findAndReplaceIf({ a: { b: { c: 'a' } } }, checkFn)
  t.deepEqual(res, { a: { b: { c: 'b' } } })
  res = findAndReplaceIf('_', checkFn)
  expect(res).toEqual('_')
  res = findAndReplaceIf('a', checkFn)
  expect(res).toEqual('b')
})

test('should work on classes', () => {
  let res, target
  class MyClass {
    prop = 0
    constructor () {
      this.prop = 1
    }
  }
  const myClass = new MyClass()
  target = {
    prop: 1,
    class: myClass,
  }
  res = findAndReplace(target, 1, 2)
  expect(res.prop).toEqual(2)
  expect(res.class.prop).toEqual(2)
})

test('should prevent classes', () => {
  let res, target
  class MyClass {
    prop = 0
    constructor () {
      this.prop = 1
    }
  }
  const myClass = new MyClass()
  target = {
    prop: 1,
    class: myClass,
  }
  res = findAndReplace(target, 1, 2, { onlyPlainObjects: true })
  expect(res.prop).toEqual(2)
  expect(res.class.prop).toEqual(1)
})
