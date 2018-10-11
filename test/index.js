import test from 'ava'
import findAndReplace from '../dist/index.cjs'

test('findAndReplace', t => {
  let res
  res = findAndReplace({a: {b: {c: 'a'}}}, 'a', 'b')
  t.deepEqual(res, {a: {b: {c: 'b'}}})
  res = findAndReplace('_', 'a', 'b')
  t.is(res, '_')
  res = findAndReplace('a', 'a', 'b')
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
