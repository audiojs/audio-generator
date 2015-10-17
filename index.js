/**
 * @module  audio-generator
 */

var Readable = require('stream').Readable;
var extend = require('xtend/mutable');
var inherits = require('inherits');
var util = require('pcm-util');
var fnbody = require('fnbody');


/**
 * @class Generator
 */
function Generator (opts) {
	if (!(this instanceof Generator)) return new Generator(opts);

	Readable.call(this);

	var self = this;

	if (typeof opts === 'function') {
		self.generate = opts;
	}
	//take over options
	else {
		extend(self, opts);
	}

	util.normalizeFormat(self);

	//current sample number
	self.count = 0;
}

inherits(Generator, Readable);



/**
 * Generate a new frame.
 * Can be redefined, returning [[LLL...], [RRR....], ...] data array
 * where L, R ∈ [0..1]
 */
Generator.prototype.generateFrame = function () {
	var self = this;

	var t = self.count / self.sampleRate;
	var values, value, offset, data = [];

	for (var channel = 0; channel < self.channels; channel++ ) {
		data[channel] = [];
	}

	try {
		for (var i = 0; i < self.samplesPerFrame; i++) {
			values = self.generate(t + i / self.sampleRate);
			if (!Array.isArray(values)) {
				values = [values];
			}
			for (var channel = 0; channel < self.channels; channel++) {
				data[channel].push(values[channel] || 0);
			}
		}
	} catch (e) {
		//NOTE: 'error' event blocks the stream
		self.emit('generror', e);
	}

	return data;
}


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

	try {
		if (typeof fn === 'string') {
			fn = new Function ('time', fn);
		}
		self.generate = fn;
	} catch (e) {
		self.emit('generror', e);
	}

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


/**
 * Read is called each time the consumer is ready to eat some more generated data.
 * So feed it till consumer is full.
 *
 * @param {Number} size Number of bytes to generate
 */
Generator.prototype._read = function (size) {
	var self = this;

	//generate frame data
	var data = self.generateFrame();

	//write generated data to buffer
	var buffer = new Buffer(self.samplesPerFrame * self.sampleSize * self.channels);

	for (var channel = 0; channel < self.channels; channel++) {
		util.copyToChannel(buffer, data[channel].map(function (value) {
			return util.convertSample(value, {float: true}, self);
		}), channel, self);
	}

	//increase generated data counter
	self.count += self.samplesPerFrame;

	//send data
	self.push(buffer);

	// after generating "duration" second of audio, emit "end"
	if (self.count >= self.sampleRate * self.duration) {
		self.push(null);
	}
}


/** Duration of generated stream, in seconds */
Generator.prototype.duration = Infinity;


/** PCM format */
extend(Generator.prototype, util.defaultFormat);


module.exports = Generator;