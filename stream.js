/**
 * @module  audio-generator
 */
'use strict';

var AudioThrough = require('audio-through');
var Generator = require('./index');

module.exports = function Stream (fn, opts) {
	//create sync map
	let fill = Generator(fn, opts);

	//create through-instance
	return new AudioThrough(fill, opts);
};
