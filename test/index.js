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
