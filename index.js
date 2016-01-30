/**
 * @module  audio-generator
 */

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
	if (typeof fn === 'function') {
		opts.generate = fn;
	}
	else {
		opts = fn;
	}

	//create through-instance
	AudioThrough.call(this, opts);
};


inherits(Generator, AudioThrough);


/** Duration of generated stream, in seconds */
Generator.prototype.duration = Infinity;


/** Period to wrap time */
Generator.prototype.period = Infinity;


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
		var moment = time + i / self.sampleRate;

		if (moment > self.duration) return null;

		var gen = self.generate(moment);

		if (!Array.isArray(gen)) {
			gen = [gen];
		}

		for (var channel = 0; channel < chunk.numberOfChannels; channel++) {
			data[channel][i] = (gen[channel] == null ? gen[0] : gen[channel]) || 0;
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

	self._generate = fn;

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