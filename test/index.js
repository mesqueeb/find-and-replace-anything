import test from 'ava'
import {findAndReplace, findAndReplaceIf} from '../dist/index.cjs'

test('findAndReplace', t => {
  let res, ori
  ori = {a: {b: {c: 'a'}}}
  res = findAndReplace(ori, 'a', 'b')
  t.deepEqual(res, {a: {b: {c: 'b'}}})
  res = findAndReplace('_', 'a', 'b')
  t.is(res, '_')
  res = findAndReplace('a', 'a', 'b')
  t.is(res, 'b')
})

test('findAndReplace does not modify objects', t => {
  let res, ori
  ori = {a: {b: {c: 'a'}, d: 1}}
  res = findAndReplace(ori, 'a', 'b')
  t.deepEqual(res, {a: {b: {c: 'b'}, d: 1}})
  t.deepEqual(ori, {a: {b: {c: 'a'}, d: 1}})
  res.a.b = 1
  t.deepEqual(res, {a: {b: 1, d: 1}})
  t.deepEqual(ori, {a: {b: {c: 'a'}, d: 1}})
  res.a.d = 2
  t.deepEqual(res, {a: {b: 1, d: 2}})
  t.deepEqual(ori, {a: {b: {c: 'a'}, d: 1}})
  ori.a.d = 3
  t.deepEqual(res, {a: {b: 1, d: 2}})
  t.deepEqual(ori, {a: {b: {c: 'a'}, d: 3}})
})

test('findAndReplace does not work with objects', t => {
  let res, ori
  ori = {a: {b: {c: 'a'}}}
  res = findAndReplace(ori, {c: 'a'}, {c: 'b'})
  t.deepEqual(res, {a: {b: {c: 'a'}}})
  t.deepEqual(ori, {a: {b: {c: 'a'}}})
})

test('findAndReplaceIf', t => {
  let res
  function checkFn (foundVal) {
    if (foundVal === 'a') return 'b'
    return foundVal
  }
  res = findAndReplaceIf({a: {b: {c: 'a'}}}, checkFn)
  t.deepEqual(res, {a: {b: {c: 'b'}}})
  res = findAndReplaceIf('_', checkFn)
  t.is(res, '_')
  res = findAndReplaceIf('a', checkFn)
  t.is(res, 'b')
})

test('should work on classes', t => {
  let res, target
  class MyClass {
    constructor () {
      this.prop = 1
    }
  }
  const myClass = new MyClass()
  target = {
    prop: 1,
    class: myClass
  }
  res = findAndReplace(target, 1, 2)
  t.is(res.prop, 2)
  t.is(res.class.prop, 2)
})

test('should prevent classes', t => {
  let res, target
  class MyClass {
    constructor () {
      this.prop = 1
    }
  }
  const myClass = new MyClass()
  target = {
    prop: 1,
    class: myClass
  }
  res = findAndReplace(target, 1, 2, {onlyPlainObjects: true})
  t.is(res.prop, 2)
  t.is(res.class.prop, 1)
})
