/**
 * @module  audio-generator
 */
'use strict';

var Generator = require('./index');

module.exports = function Stream (fn, opts) {
	let generate = Generator(fn, opts);
	let ended = false;

	let stream = (end, cb) => {
		if (end || ended) {
			ended = true;
			return cb && cb(true);
		}

		return cb(null, generate());
	}

	//FIXME: this is apparently bad, we gotta manually make call with end set to true
	stream.abort = () => {ended = true}

	return stream;
};
