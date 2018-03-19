<img alt="Beetle holding Unicode character" src="unenki-logo.png" width="200" align="right">

# Unenki

> 🔢  Encode ANSI Escape sequences to Unicode Literal strings: `\u001b` > `\\u001b`

[![Build Status](https://travis-ci.org/F1LT3R/unenki.svg?branch=master)](https://travis-ci.org/F1LT3R/unenki)
[![Coverage Status](https://coveralls.io/repos/github/F1LT3R/unenki/badge.svg?branch=master)](https://coveralls.io/github/F1LT3R/unenki?branch=master)
[![Npm Version](https://img.shields.io/npm/v/unenki.svg)](https://www.npmjs.com/package/unenki)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

## Why

Logging colored text to the console requires ANSI escape sequences. These ANSI escape sequences include unicode characters like `\u001b`.

When testing software it can become hard to grok the difference between the expected and the actual result when the ANSI escape sequences are used.  To remedy this, Unenki encodes ANSI escape sequences to lower-case unicode literals, while keeping certain ASCII characters.

## Encode

Encode unicode ANSI escape characters to a console friendly string:

```javascript
const unenki = require('unenki')
const chalk = require('chalk')

// Blue text
const ansiEscapedStr = '\u001b[34m HELLO_BLUE_WORLD! \u001b[39m'

const encoded = unenki.encode(ansiEscapedStr)
// '\\u001b[34m HELLO_BLUE_WORLD! \\u001b[39m'
```

## Strip

Strips ANSI escape sequences from unencoded ansi-escaped strings:

```js
const unenki = require('unenki')
const chalk = require('chalk')

const ansiEscapedStr = chalk.green('Test')

const result = unenki.strip(ansiEscapedStr)
// Result = 'Test'
```

## Strip Encoded

Strips Unicode literals from an encoded string:

```javascript
const unenki = require('unenki')

const ansiEscapedStr = chalk.green('Test')
const encoded = unenki.encode(ansiEscapedStr)

const result = unenki.stripEncoded(encoded)
// Result = 'Test'
```

## Keep

Do not encode certain characters:

```js
const ansiEscapedStr = chalk.green('"Test"')

const opts = {
    keep: ['"']
}

const result = unenki.encode(ansiEscapedStr, opts)
// Result = '\\u001b[32m"Test"\\u001b[39m'
```

## Force

Force certain characters to encode to different strings:

```js
const ansiEscapedStr = chalk.green('a\nb')

const opts = {
    force: {
        '\n': '\\n'
    }
}

const result = unenki.encode(ansiEscapedStr, opts)
// Result = 'a\\n\b'
```

## Installation

```shell
yarn add unenki
```