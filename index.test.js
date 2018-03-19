import chalk from 'chalk'
import test from 'ava'
import chromafi from 'chromafi'
import unenki from '.'

test('Convert ANSI sequences to regular strings.', t => {
	const ansiEscapedStr = chalk.green('TEST')
	const result = unenki.encode(ansiEscapedStr)
	t.is(typeof result, 'string')
	t.is(result, '\\u001b[32mTEST\\u001b[39m')
})

test('Double quotes do not get escaped.', t => {
	const ansiEscapedStr = chalk.green('"Test"')
	const keep = ['"']
	const opts = {keep}
	const result = unenki.encode(ansiEscapedStr, opts)
	t.is(typeof result, 'string')
	t.is(result, '\\u001b[32m"Test"\\u001b[39m')
})

test('Convert ANSI Emoji sequences to regular strings.', t => {
	const ansiEscapedStr = chalk.bgYellow.black(' 🖍, 🌈 & 🦄\'s ')
	const keep = ['\'']
	const opts = {keep}
	const result = unenki.encode(ansiEscapedStr, opts)
	t.is(typeof result, 'string')
	t.is(result, '\\u001b[43m\\u001b[30m \\ud83d\\udd8d, \\ud83c\\udf08 \\u0026 \\ud83e\\udd84\'s \\u001b[39m\\u001b[49m')
})

test('Keep(ary): encode everything except unicode double escape sequences for unicorns & rainbows', t => {
	const ansiEscapedStr = '🖍🌈🦄'

	// Unicode literal double escape sequences
	const keep = [
		// Pencil Emoji
		// '\ud83d', '\udd8d',

		// Rainbow Emoji
		// eslint-disable-next-line unicorn/escape-case
		'\ud83c', '\udf08',

		// Unicorn Emoji
		// eslint-disable-next-line unicorn/escape-case
		'\ud83e', '\udd84'
	]
	const opts = {keep}
	const result = unenki.encode(ansiEscapedStr, opts)
	t.is(typeof result, 'string')
	t.is(result, '\\ud83d\\udd8d🌈🦄')
})

test('Force(ary): force conversion of \\n to \\\\n (like JSON.stringify() will do)', t => {
	const ansiEscapedStr = 'a\nb'
	const force = {
		'\n': '\\n',
		b: 'B'
	}
	const opts = {force}
	const result = unenki.encode(ansiEscapedStr, opts)
	t.is(typeof result, 'string')
	t.is(result, 'a\\nB')
})

test('Chalk() ANSI sequences with \\n add extra escapes.', t => {
	const ansiEscapedStr = chalk.green('Hello,') + '\n' + chalk.red(' world!')
	const result = unenki.encode(ansiEscapedStr)
	t.is(typeof result, 'string')
	// eslint-disable-next-line unicorn/escape-case
	t.is(result, '\\u001b[32mHello,\\u001b[39m\n\\u001b[31m world!\\u001b[39m')
})

test('Throws when no param passed.', t => {
	const error = t.throws(() => {
		unenki.encode()
	}, TypeError)

	t.is(error.message, 'AnsiEncode.encode: You must pass a string!')
})

test('Throws when number passed.', t => {
	const error = t.throws(() => {
		unenki.encode(1)
	}, TypeError)

	t.is(error.message, 'AnsiEncode.encode: You must pass a string!')
})

test('Throws when boolean passed.', t => {
	const error = t.throws(() => {
		unenki.encode(true)
	}, TypeError)

	t.is(error.message, 'AnsiEncode.encode: You must pass a string!')
})

test('Throws when null passed.', t => {
	const error = t.throws(() => {
		unenki.encode(null)
	}, TypeError)

	t.is(error.message, 'AnsiEncode.encode: You must pass a string!')
})

test('Throws when object passed.', t => {
	const error = t.throws(() => {
		unenki.encode({})
	}, TypeError)

	t.is(error.message, 'AnsiEncode.encode: You must pass a string!')
})

test('Throws when function passed.', t => {
	const error = t.throws(() => {
		unenki.encode(() => {})
	}, TypeError)

	t.is(error.message, 'AnsiEncode.encode: You must pass a string!')
})

test('Can strip ANSI escape sequences from ansi-encoded strings.', t => {
	const ansiEscapedStr = chalk.green('Test')
	const encoded = unenki.encode(ansiEscapedStr)
	const result = unenki.stripEncoded(encoded)
	t.is(typeof result, 'string')
	t.is(result, 'Test')
})

test('Can strip ANSI escape sequences from ansi-escaped strings.', t => {
	const ansiEscapedStr = chalk.green('Test')
	const result = unenki.strip(ansiEscapedStr)
	t.is(typeof result, 'string')
	t.is(result, 'Test')
})

test('Multi-line JSON highlighting with fn strings.', t => {
	const jsObject = {
		foo: 'bar',
		baz: 1337,
		qux: true,
		zxc: null,
		// eslint-disable-next-line object-shorthand
		spqr: function (a, b) {
			return b - a
		}
	}
	const highlighted = chromafi(jsObject)
	const opts = {
		keep: ['\'']
	}
	const encoded = unenki.encode(highlighted, opts)
	t.is(encoded, "\\u001b[37m\\u001b[90m  1 \\u001b[37m {                           \\u001b[39m\n\\u001b[37m\\u001b[90m  2 \\u001b[37m     \\u001b[33mfoo:\\u001b[37m \\u001b[33m'bar'\\u001b[37m,             \\u001b[39m\n\\u001b[37m\\u001b[90m  3 \\u001b[37m     \\u001b[33mbaz:\\u001b[37m \\u001b[32m1337\\u001b[37m,              \\u001b[39m\n\\u001b[37m\\u001b[90m  4 \\u001b[37m     \\u001b[33mqux:\\u001b[37m \\u001b[35mtrue\\u001b[37m,              \\u001b[39m\n\\u001b[37m\\u001b[90m  5 \\u001b[37m     \\u001b[33mzxc:\\u001b[37m \\u001b[35mnull\\u001b[37m,              \\u001b[39m\n\\u001b[37m\\u001b[90m  6 \\u001b[37m     \\u001b[33mspqr:\\u001b[37m \\u001b[37m\\u001b[37m\\u001b[31mfunction\\u001b[37m (\\u001b[34ma, b\\u001b[37m) \\u001b[37m{\\u001b[37m \\u001b[39m\n\\u001b[37m\\u001b[90m  7 \\u001b[37m \\u001b[37m            \\u001b[31mreturn\\u001b[37m b - a;\\u001b[37m   \\u001b[39m\n\\u001b[37m\\u001b[90m  8 \\u001b[37m \\u001b[37m        }\\u001b[37m                   \\u001b[39m\n\\u001b[37m\\u001b[90m  9 \\u001b[37m }                           \\u001b[39m\n\\u001b[37m\\u001b[39m")
})
