# parse-env-string

Parse a string containing environment variables to a key/value object.

[![npm](https://img.shields.io/npm/v/parse-env-string.svg)](https://www.npmjs.com/package/parse-env-string)
[![build status](https://travis-ci.org/watson/parse-env-string.svg?branch=master)](https://travis-ci.org/watson/parse-env-string)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install parse-env-string --save
```

## Usage

```js
const parseEnvString = require('parse-env-string')

const env = parseEnvString('foo=hello bar= baz=", world"') 

assert.deepStrictEqual(env, {
  foo: 'hello',
  bar: '',
  baz: ', world'
})
```

## API

This modules exposes a single function:

```
parseEnvString([string])
```

It takes a string and returns an object. If given `null` or `undefined`
an empty object is returned. If given anything else, a `TypeError` is
thrown.

An `Error` will also be thrown if the provided string doesn't contain
valid environment variables. E.g. if given the string `1a=b`, an error
will be thrown because environment variables cannot have a digit as the
first character.

## License

[MIT](LICENSE)
