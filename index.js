/**
 * @module  audio-generator
 */
'use strict';

var extend = require('xtend/mutable');
var util = require('audio-buffer-utils');
var pcm = require('pcm-util');


module.exports = Generator;


/**
 * Sync map constructor
 * @constructor
 */
function Generator (fn, opts) {
	if (fn instanceof Function) {
		opts = opts || {};
		opts.generate = fn;
	}
	else {
		opts = fn || {};
	}

	//sort out arguments
	opts = extend({
		//total duration of a stream
		duration: Infinity,

		//time repeat period, in seconds, or 1/frequency
		period: Infinity,

		//inferred from period
		//frequency: 0,

		/**
		 * Generate sample value for a time.
		 * Returns [L, R, ...] or a number for each channel
		 *
		 * @param {number} time current time
		 */
		generate: Math.random
	}, pcm.defaults, opts);

	//align frequency/period
	if (opts.frequency != null) {
		opts.period = 1 / opts.frequency;
	} else {
		opts.frequency = 1 / opts.period;
	}

	let time = 0, count = 0;

	//wrapper for convenience, there is nothing to end
	generate.end = function () {};

	return generate;

	//return sync source/map
	function generate (buffer) {
		if (!buffer) buffer = util.create(opts.channels, opts.samplesPerFrame, opts.sampleRate);

		//get audio buffer channels data in array
		var data = util.data(buffer);

		//generate [channeled] samples
		for (var i = 0; i < buffer.length; i++) {
			var moment = time + i / opts.sampleRate;

			//end generation, if enough
			if (moment > opts.duration) return null;

			//rotate by period
			if (opts.period !== Infinity) {
				moment %= opts.period;
			}

			var gen = opts.generate(moment);

			//treat null as end
			if (gen === null) {
				return gen;
			}

			//wrap number value
			if (!Array.isArray(gen)) {
				gen = [gen || 0];
			}

			//distribute generated data by channels
			for (var channel = 0; channel < buffer.numberOfChannels; channel++) {
				data[channel][i] = (gen[channel] == null ? gen[0] : gen[channel]);
			}
		}

		//update counters
		count += buffer.length;
		time = count / opts.sampleRate;

		return buffer;
	}
}


