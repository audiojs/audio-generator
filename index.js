/**
 * @module  audio-generator
 */

var Readable = require('stream').Readable;
var extend = require('xtend/mutable');
var inherits = require('inherits');
var os = require('os');

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


	//current sample number
	self.count = 0;
}

inherits(Generator, Readable);



/** Generate a new frame */
Generator.prototype.generateFrame = function () {
	var self = this;

	var t = self.count / self.sampleRate;
	var values, value, offset;

	var sampleSize = self.bitDepth / 8;
	var methName = 'write' + (self.float ? 'Float' : ((self.signed ? '' : 'U') + 'Int' + self.bitDepth)) + self.byteOrder;

	var chunk = new Buffer(self.samplesPerFrame * sampleSize * self.channels);
	chunk.fill(0);

	try {
		for (var i = 0; i < self.samplesPerFrame; i++) {
			values = self.generate(t + i / self.sampleRate);
			if (!Array.isArray(values)) {
				values = [values];
			}
			for (var channel = 0; channel < self.channels; channel++) {
				value = Math.floor(values[channel] || 0);
				offset = self.interleaved ? channel + i * self.channels : channel * self.samplesPerFrame + i;
				chunk[methName](value, offset * sampleSize);
			}
		}
	} catch (e) {
		//NOTE: 'error' event blocks the stream
		self.emit('generror', e);
		console.log(e)
	}

	self.count += self.samplesPerFrame;

	return chunk;
}


/**
 * Read is called each time the consumer is ready to eat some more generated data.
 * So feed it till consumer is full.
 *
 * @param {Number} size Number of bytes to generate
 */
Generator.prototype._read = function (size) {
	var self = this;

	//send the chunk till possible
	self.push(self.generateFrame());

	// after generating "duration" second of audio, emit "end"
	if (self.count >= self.sampleRate * self.duration) {
		self.push(null);
	}
}


/**
 * Generate sample value for a time.
 * Override this method in instances.
 *
 * @param {number} time current time
 * @return {number} [-1..1]
 */
Generator.prototype.generate = function (time) {
	return Math.random();
}

/** Duration of generated stream, in seconds */
Generator.prototype.duration = Infinity;

/** PCM format */
Generator.prototype.channels = 2;
Generator.prototype.sampleRate = 44100;
Generator.prototype.samplesPerFrame = 64;
Generator.prototype.bitDepth = 16;
Generator.prototype.signed = true;
Generator.prototype.float = false;
Generator.prototype.byteOrder = 'function' == os.endianness ? os.endianness() : 'LE';
Generator.prototype.interleaved = true;

module.exports = Generator;