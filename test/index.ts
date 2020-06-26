import test from 'ava'
import { findAndReplace, findAndReplaceIf } from '../src/index'
import { isPlainObject } from 'is-what'

test('findAndReplace in arrays', t => {
  const res = findAndReplace({ a: [{ b: 'c' }] }, 'c', 'd', { checkArrayValues: true })
  t.deepEqual(res, {
    a: [{ b: 'd' }],
  })
})

test('findAndReplaceIf in arrays', t => {
  const replacer = foundVal => (foundVal === 'c' ? 'd' : foundVal)
  t.deepEqual(findAndReplaceIf({ a: ['c'] }, replacer, { checkArrayValues: true }), {
    a: ['d'],
  })
})

test('findAndReplaceIf in arrays double nested', t => {
  const replacer = foundVal => (foundVal === 'c' ? 'd' : foundVal)
  t.deepEqual(findAndReplaceIf({ a: [{ b: 'c' }, 'c'] }, replacer, { checkArrayValues: true }), {
    a: [{ b: 'd' }, 'd'],
  })
})

test('findAndReplace nested strings', t => {
  t.deepEqual(findAndReplace({ a: { b: { c: 'a' } } }, 'a', 'b'), { a: { b: { c: 'b' } } })
})

test('findAndReplace strings', t => {
  t.is(findAndReplace('a', 'a', 'b'), 'b')
  t.is(findAndReplace('_', 'a', 'b'), '_')
})

test('findAndReplace undefined', t => {
  t.deepEqual(findAndReplace({ undefined: undefined }, undefined, 'undefined'), {
    undefined: 'undefined',
  })
})
test('findAndReplace NaN', t => {
  t.deepEqual(findAndReplace({ NaN: NaN }, NaN, 'NaN'), { NaN: 'NaN' })
})
test('findAndReplace null', t => {
  t.deepEqual(findAndReplace({ null: null }, null, 'null'), { null: 'null' })
})

test('findAndReplace does not modify objects', t => {
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

test('findAndReplace does not work with objects', t => {
  let res, ori
  ori = { a: { b: { c: 'a' } } }
  res = findAndReplace(ori, { c: 'a' }, { c: 'b' })
  t.deepEqual(res, { a: { b: { c: 'a' } } })
  t.deepEqual(ori, { a: { b: { c: 'a' } } })
})

test('findAndReplaceIf', t => {
  let res
  function checkFn (foundVal) {
    if (foundVal === 'a') return 'b'
    return foundVal
  }
  res = findAndReplaceIf({ a: { b: { c: 'a' } } }, checkFn)
  t.deepEqual(res, { a: { b: { c: 'b' } } })
  res = findAndReplaceIf('_', checkFn)
  t.is(res, '_')
  res = findAndReplaceIf('a', checkFn)
  t.is(res, 'b')
})

test('should work on classes', t => {
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
  t.is(res.prop, 2)
  t.is(res.class.prop, 2)
})

test('should prevent classes', t => {
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
  t.is(res.prop, 2)
  t.is(res.class.prop, 1)
})
