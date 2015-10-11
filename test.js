var Generator = require('./');
var Speaker = require('speaker');
var PCMFormat = require('audio-pcm-format');
var assert = require('assert');


describe('Sounds', function () {
	var speaker = Speaker();

	it('Panned wave', function (done) {
		var generator = Generator({
			generate: function (time) {
				return [Math.sin(Math.PI * 2 * time * 439), Math.sin(Math.PI * 2 * time * 441)];
			},
			duration: .5
		}).on('end', done);

		var speaker = Speaker();

		generator.pipe(speaker);
	});

	it('Left channel noise', function (done) {
		var generator = Generator({
			generate: function (time) {
				return Math.random();
			},
			duration: .5
		}).on('end', done);

		generator.pipe(speaker);
	});
});


describe('Output format', function () {
	it('Float', function (done) {
		var generator = Generator({
			generate: function (time) {
				return Math.random();
			},
			duration: .1,
			float: true
		}).on('end', done);

		generator.on('data', function (chunk) {
			var val1 = chunk.readFloatLE(0);
			assert(val1 < 1);
			assert(val1 > -1);

			var val2 = chunk.readFloatLE(4);
			assert(val2 < 1);
			assert(val2 > -1);
		});
	});

	it('Int', function (done) {
		var generator = Generator({
			generate: function (time) {
				return Math.random();
			},
			duration: .1
		}).on('end', done);

		generator.on('data', function (chunk) {
			var val1 = chunk.readInt16LE(0);
			assert(val1 < 37768);
			assert(val1 > -37768);

			var val2 = chunk.readInt16LE(4);
			assert(val2 < 37768);
			assert(val2 > -37768);
		});
	});
});