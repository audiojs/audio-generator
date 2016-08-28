/**
 * @module  audio-generator
 */
'use strict';

var inherits = require('inherits');
var fnbody = require('fnbody');
var AudioThrough = require('audio-through');
var extend = require('xtend/mutable');
var util = require('audio-buffer-utils');


/**
 * @class Generator
 */
function Generator (fn, opts) {
	if (!(this instanceof Generator)) return new Generator(fn, opts);

	var self = this;

	//set generator function
	if (!opts) opts = {};
	if (typeof fn === 'function') {
		opts.generate = fn;
	}
	else {
		opts = fn;
	}

	//create through-instance
	AudioThrough.call(this, opts);

	//align frequency/period
	if (self.frequency != null) {
		self.period = 1 / self.frequency;
	} else {
		self.frequency = 1 / self.period;
	}
};


inherits(Generator, AudioThrough);


/** Duration of generated stream, in seconds */
Generator.prototype.duration = Infinity;


/** Period to wrap time */
Generator.prototype.period = Infinity;


/** Frequency, related to period */
Generator.prototype.frequency;


/**
 * The way we define through processor
 */
Generator.prototype.process = function (chunk) {
	var self = this;

	var time = self.time, count = self.count;

	//we don’t need to return new chunk, we just modify channels data
	var data = util.data(chunk);

	//generate [channeled] samples
	for (var i = 0; i < chunk.length; i++) {
		var moment = time + i / self.format.sampleRate;

		//end generation, if enough
		if (moment > self.duration) return null;

		//rotate by period
		if (self.period !== Infinity) {
			moment %= self.period;
		}

		var gen = self.generate(moment);

		//treat null as null
		if (gen === null) {
			return null;
		}

		//wrap number value
		if (!Array.isArray(gen)) {
			gen = [gen || 0];
		}

		for (var channel = 0; channel < chunk.numberOfChannels; channel++) {
			data[channel][i] = (gen[channel] == null ? gen[0] : gen[channel]);
		}
	}
};


/**
 * Generate sample value for a time.
 * Override this method in instances.
 * Return [L, R, ...] tuple.
 *
 * @param {number} time current time
 * @return {number} [-1..1]
 */
Generator.prototype.generate = function (time) {return Math.random();};


/**
 * Set new generator function
 *
 * @param {Function} fn New generator function
 */
Generator.prototype.setFunction = function (fn) {
	var self = this;

	if (typeof fn === 'string') {
		try {
			fn = new Function ('time', fn);
		} catch (e) {
			self.error(e);
		}
	}

	self.generate = fn;

	return self;
};


/**
 * Serialize stream settings
 */
Generator.prototype.toJSON = function () {
	return {
		generate: fnbody(this.generate)
	};
};


module.exports = Generator;
