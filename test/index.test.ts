import { test, expect } from 'vitest'
import { findAndReplace, findAndReplaceIf } from '../src/index'
import { isPlainObject } from 'is-what'

test('findAndReplace in arrays', () => {
  const res = findAndReplace({ a: [{ b: 'c' }] }, 'c', 'd', { checkArrayValues: true })
  expect(res).toEqual({
    a: [{ b: 'd' }],
  })
})

test('findAndReplaceIf in arrays', () => {
  const replacer = (foundVal: any) => (foundVal === 'c' ? 'd' : foundVal)
  expect(findAndReplaceIf({ a: ['c'] }, replacer, { checkArrayValues: true })).toEqual({
    a: ['d'],
  })
})

test('findAndReplaceIf in arrays double nested', () => {
  const replacer = (foundVal: any) => (foundVal === 'c' ? 'd' : foundVal)
  expect(findAndReplaceIf({ a: [{ b: 'c' }, 'c'] }, replacer, { checkArrayValues: true })).toEqual({
    a: [{ b: 'd' }, 'd'],
  })
})

test('findAndReplace nested strings', () => {
  expect(findAndReplace({ a: { b: { c: 'a' } } }, 'a', 'b')).toEqual({ a: { b: { c: 'b' } } })
})

test('findAndReplace strings', () => {
  expect(findAndReplace('a', 'a', 'b')).toEqual('b')
  expect(findAndReplace('_', 'a', 'b')).toEqual('_')
})

test('findAndReplace undefined', () => {
  expect(findAndReplace({ undefined: undefined }, undefined, 'undefined')).toEqual({
    undefined: 'undefined',
  })
})
test('findAndReplace NaN', () => {
  expect(findAndReplace({ NaN: NaN }, NaN, 'NaN')).toEqual({ NaN: 'NaN' })
})
test('findAndReplace null', () => {
  expect(findAndReplace({ null: null }, null, 'null')).toEqual({ null: 'null' })
})

test('findAndReplace does not modify objects', () => {
  let res, ori
  ori = { a: { b: { c: 'a' }, d: 1 } }
  res = findAndReplace(ori, 'a', 'b')
  expect(res).toEqual({ a: { b: { c: 'b' }, d: 1 } })
  expect(ori).toEqual({ a: { b: { c: 'a' }, d: 1 } })
  res.a.b = 1
  expect(res).toEqual({ a: { b: 1, d: 1 } })
  expect(ori).toEqual({ a: { b: { c: 'a' }, d: 1 } })
  res.a.d = 2
  expect(res).toEqual({ a: { b: 1, d: 2 } })
  expect(ori).toEqual({ a: { b: { c: 'a' }, d: 1 } })
  ori.a.d = 3
  expect(res).toEqual({ a: { b: 1, d: 2 } })
  expect(ori).toEqual({ a: { b: { c: 'a' }, d: 3 } })
})

test('findAndReplace does not work with objects', () => {
  let res, ori
  ori = { a: { b: { c: 'a' } } }
  res = findAndReplace(ori, { c: 'a' }, { c: 'b' })
  expect(res).toEqual({ a: { b: { c: 'a' } } })
  expect(ori).toEqual({ a: { b: { c: 'a' } } })
})

test('findAndReplaceIf', () => {
  let res
  function checkFn(foundVal: any) {
    if (foundVal === 'a') return 'b'
    return foundVal
  }
  res = findAndReplaceIf({ a: { b: { c: 'a' } } }, checkFn)
  expect(res).toEqual({ a: { b: { c: 'b' } } })
  res = findAndReplaceIf('_', checkFn)
  expect(res).toEqual('_')
  res = findAndReplaceIf('a', checkFn)
  expect(res).toEqual('b')
})

test('should work on classes', () => {
  let res, target
  class MyClass {
    prop = 0
    constructor() {
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
    constructor() {
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
