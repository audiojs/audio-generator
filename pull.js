/**
 * @module  audio-generator
 */
'use strict';

var pull = require('pull-stream/pull');
var infinite = require('pull-stream/sources/infinite');
var pcm = require('pcm-util');
var Generator = require('./index');

module.exports = function Stream (fn, opts) {
	var format = pcm.format(options);
	pcm.normalize(format);

	// create source
	return pull(
		// create buffer of needed size
		pull.infinite(function () {
			return new AudioBuffer(format.samplesPerFrame);
		}),
		// fill buffer with generator function
		pull.map(Generator(fn, opts))
	)
};
