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
				if (!time) return 1;
				else return -0.5;
			},
			duration: .001,
			float: true,
			channels: 1
		});

		generator.on('data', function (chunk) {
			var val1 = chunk.readFloatLE(0);
			var val2 = chunk.readFloatLE(4);

			try {
				assert.equal(val1, 1);
				assert.equal(val2, -0.5);
				done();
			} catch (e) {
				done(e);
			}
		});
	});

	it('Int', function (done) {
		var generator = Generator({
			generate: function (time) {
				if (!time) return 1;
				else return -0.5;
			},
			duration: .001,
			channels: 1
		});

		generator.on('data', function (chunk) {
			var val1 = chunk.readInt16LE(0);
			var val2 = chunk.readInt16LE(4);

			try {
				assert.equal(val1, 32767);
				assert.equal(val2, -16384);
				done();
			} catch (e) {
				done(e);
			}
		});
	});
});