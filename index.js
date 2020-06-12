'use strict'

module.exports = parseEnvString

const states = Object.freeze({
  KEY_START: Symbol('key-start'),
  KEY: Symbol('key'),
  VALUE_START: Symbol('value-start'),
  VALUE: Symbol('value')
})

const CHAR_TAB = 9
const CHAR_SPACE = 32
const CHAR_DOUBLE_QUOTE = 34
const CHAR_SINGLE_QUOTE = 39
const CHAR_DIGIT_0 = 48
const CHAR_DIGIT_9 = 57
const CHAR_EQUAL = 61
const CHAR_UPPERCASE_A = 65
const CHAR_UPPERCASE_Z = 90
const CHAR_BACKSLASH = 92
const CHAR_UNDERSCORE = 95
const CHAR_LOWERCASE_A = 97
const CHAR_LOWERCASE_Z = 122

function parseEnvString (str) {
  if (str == null) return {}
  if (typeof str !== 'string') throw new TypeError(`Expected first argument to be a string, null or undefined, recived ${typeof str}`)

  let code, key, val, endOfValueCode
  let state = states.KEY_START
  const env = {}

  // console.log(str)
  for (let i = 0; i < str.length; i++) {
    code = str.charCodeAt(i)
    // debug()

    switch (state) {
      case states.KEY_START:
        if (validWhitespace(code)) break
        key = ''
        val = ''
        endOfValueCode = -1
        state = states.KEY
        if (validKeyFirstChar(code)) key += str[i]
        else throw new Error(`Invalid character at position ${i + 1}: ${code}`)
        break
      case states.KEY:
        if (validKeyChar(code)) key += str[i]
        else if (validKeyValueDelimiter(code)) state = states.VALUE_START
        else throw new Error(`Invalid character at position ${i + 1}: ${code}`)
        break
      case states.VALUE_START:
        state = states.VALUE
        if (validQuote(code)) endOfValueCode = code
        else i--
        break
      case states.VALUE:
        if (validEscape(code)) {
          if (str.length === i + 1) throw new Error('Invalid escape character at the end of string')
          val += str[++i]
        } else if (validEndOfValue(code, endOfValueCode)) {
          setEnv(env, key, val)
          state = states.KEY_START
        } else {
          val += str[i]
        }
        break
    }

    // function debug () {
    //   console.log(`[${state.toString()}] pos: ${i}, code: ${code}, char: "${str[i]}", key: "${key}", val: "${val}", env: ${JSON.stringify(env)}`)
    // }
  }

  switch (state) {
    case states.KEY_START:
      break
    case states.KEY:
      throw new Error(`No value found for key "${key}"`)
    case states.VALUE:
      if (endOfValueCode !== -1) throw new Error('Missing end quote')
      setEnv(env, key, val)
      break
    default:
      throw new Error(`Reached unexpected state: ${state.toString()}`)
  }

  return env
}

function setEnv (env, key, value) {
  if (key === '__proto__') {
    Object.defineProperty(env, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    })
  } else {
    env[key] = value
  }
}

function validEndOfValue (code, endOfValueCode) {
  if (endOfValueCode === -1) return validWhitespace(code)
  else return code === endOfValueCode
}

function validKeyFirstChar (code) {
  // [A-Z_a-z]
  return (
    (code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z) ||
    code === CHAR_UNDERSCORE ||
    (code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z)
  )
}

function validKeyChar (code) {
  // [0-9A-Z_a-z]
  return (
    (code >= CHAR_DIGIT_0 && code <= CHAR_DIGIT_9) ||
    validKeyFirstChar(code)
  )
}

function validWhitespace (code) {
  // [\t ]
  return code === CHAR_TAB || code === CHAR_SPACE
}

function validKeyValueDelimiter (code) {
  // [=]
  return code === CHAR_EQUAL
}

function validQuote (code) {
  // ["']
  return code === CHAR_DOUBLE_QUOTE || code === CHAR_SINGLE_QUOTE
}

function validEscape (code) {
  // [\\]
  return code === CHAR_BACKSLASH
}
