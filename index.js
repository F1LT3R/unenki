const he = require('he')

const encode = (str, opts) => {
	if (typeof str !== 'string') {
		throw new TypeError('AnsiEncode.encode: You must pass a string!')
	}

	let output = ''

	for (let i = 0; i < str.length; i += 1) {
		const char = str[i]
		const enc = he.encode(char)

		if (opts && opts.keep && opts.keep.includes(char)) {
			output += char
		} else if (opts && opts.force && Reflect.has(opts.force, char)) {
			output += opts.force[char]
		} else if (enc.length > 1) {
			output += '\\u' + enc
				.substr(3, enc.indexOf(';') - 3)
				.padStart(4, 0)
				.toLowerCase()
		} else {
			output += char
		}
	}

	return output
}

const stripEncoded = str => {
	if (typeof str !== 'string') {
		throw new TypeError('AnsiEncode.stripEncoded: You must pass a string!')
	}

	return str.replace(/\\\D....\[\d.m/gi, '')
}

const strip = str => {
	if (typeof str !== 'string') {
		throw new TypeError('AnsiEncode.strip: You must pass a string!')
	}

	const encoded = encode(str)
	return encoded.replace(/\\\D....\[\d.m/gi, '')
}

module.exports = {
	encode,
	stripEncoded,
	strip
}
