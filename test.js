'use strict'

const test = require('tape')
const parseEnvString = require('./')

test('null', t => {
  t.deepEqual(parseEnvString(null), {})
  t.end()
})

test('undefined', t => {
  t.deepEqual(parseEnvString(undefined), {})
  t.end()
})

test('empty string', t => {
  t.deepEqual(parseEnvString(''), {})
  t.deepEqual(parseEnvString(' '), {})
  t.deepEqual(parseEnvString('\t'), {})
  t.end()
})

test('invalid argument', t => {
  t.throws(() => parseEnvString({}), TypeError)
  t.throws(() => parseEnvString(true), TypeError)
  t.throws(() => parseEnvString(42), TypeError)
  t.throws(() => parseEnvString(NaN), TypeError)
  t.throws(() => parseEnvString(Symbol('foo')), TypeError)
  t.end()
})

test('one key', t => {
  t.deepEqual(parseEnvString('foo=bar'), { foo: 'bar' })
  t.end()
})

test('multiple keys', t => {
  t.deepEqual(parseEnvString('a=1 b=2 c=3'), { a: '1', b: '2', c: '3' })
  t.end()
})

test('duplicate keys', t => {
  t.deepEqual(parseEnvString('a=1 b=2 b=3'), { a: '1', b: '3' })
  t.end()
})

test('invalid key first letter', t => {
  t.throws(() => parseEnvString('1a=bar'))
  t.end()
})

test('invalid key second letter', t => {
  t.throws(() => parseEnvString('a-b=bar'))
  t.end()
})

test('key only', t => {
  t.throws(() => parseEnvString('f'))
  t.throws(() => parseEnvString('foo'))
  t.end()
})

test('leading whitespace', t => {
  t.deepEqual(parseEnvString(' foo=bar'), { foo: 'bar' })
  t.deepEqual(parseEnvString('\tfoo=bar'), { foo: 'bar' })
  t.end()
})

test('trailing whitespace', t => {
  t.deepEqual(parseEnvString('foo=bar '), { foo: 'bar' })
  t.deepEqual(parseEnvString('foo=bar\t'), { foo: 'bar' })
  t.end()
})

test('whitespace after key', t => {
  t.throws(() => parseEnvString('foo =bar'), /Invalid character at position 4/)
  t.throws(() => parseEnvString('foo = bar'), /Invalid character at position 4/)
  t.end()
})

test('no value', t => {
  t.deepEqual(parseEnvString('foo= '), { foo: '' })
  t.deepEqual(parseEnvString('a= b=2'), { a: '', b: '2' })
  t.end()
})

test('single quotes', t => {
  t.deepEqual(parseEnvString('foo=\'bar baz\''), { foo: 'bar baz' })
  t.deepEqual(parseEnvString('foo=\'\''), { foo: '' })
  t.deepEqual(parseEnvString('foo=\'\n\''), { foo: '\n' })
  t.end()
})

test('single quotes, missing end', t => {
  t.throws(() => parseEnvString('foo=\'bar'), /Missing end quote/)
  t.throws(() => parseEnvString('a=\'1 b=\'2\''), /Invalid character at position 9/)
  t.end()
})

test('double quotes', t => {
  t.deepEqual(parseEnvString('foo="bar baz"'), { foo: 'bar baz' })
  t.deepEqual(parseEnvString('foo=""'), { foo: '' })
  t.deepEqual(parseEnvString('foo="\n"'), { foo: '\n' })
  t.end()
})

test('double quotes, missing end', t => {
  t.throws(() => parseEnvString('foo="bar'), /Missing end quote/)
  t.throws(() => parseEnvString('a="1 b="2"'), /Invalid character at position 9/)
  t.end()
})

test('escape whitespace', t => {
  t.deepEqual(parseEnvString('foo=bar\\ baz'), { foo: 'bar baz' })
  t.end()
})

test('escape escape', t => {
  t.deepEqual(parseEnvString('foo=bar\\\\baz'), { foo: 'bar\\baz' })
  t.end()
})

test('escape single quote', t => {
  t.deepEqual(parseEnvString('foo=\'bar\\\'baz\''), { foo: 'bar\'baz' })
  t.end()
})

test('escape double quote', t => {
  t.deepEqual(parseEnvString('foo="bar\\"baz"'), { foo: 'bar"baz' })
  t.end()
})

test('escape end', t => {
  t.throws(() => parseEnvString('foo=bar\\'), /Invalid escape character at the end of string/)
  t.end()
})

test('prototype pollution', t => {
  t.deepEqual(parseEnvString('__proto__=foo'), { ['__proto__']: 'foo' })
  t.end()
})

test('all together now', t => {
  t.deepEqual(
    parseEnvString('  a=\'foo bar\' b="a \'b\'\nc" c=3 d=foo\\ bar\\\\ e=  '),
    { a: 'foo bar', b: 'a \'b\'\nc', c: '3', d: 'foo bar\\', e: '' }
  )
  t.end()
})
