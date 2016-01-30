var Generator = require('./');
var Speaker = require('speaker');
var assert = require('assert');
var util = require('audio-buffer-utils');


describe('Sounds', function () {
	it('Panned wave', function (done) {
		var generator = Generator(
			function (time) {
				return [Math.sin(Math.PI * 2 * time * 439), Math.sin(Math.PI * 2 * time * 441)];
			},
			{
				duration: .5
			}
		).on('end', done);

		generator.pipe(Speaker());
	});

	it('Left channel noise', function (done) {
		var generator = Generator({
			generate: function (time) {
				return Math.random();
			},
			duration: .5
		}).on('end', done);

		var speaker = Speaker();

		generator.pipe(speaker);
	});

	it('Sin noise', function (done) {
		var generator = Generator({
			generate: function (time) {
				var noise = Math.random() * 2 - 1;
				var f = 400;
				return Math.sin(Math.PI * 2 * time * f) * 0.5 + noise * 0.5;
			},
			duration: .5
		}).on('end', done);

		var speaker = Speaker();

		generator.pipe(speaker);
	});

	it.only('Saw', function (done) {
		Generator(function (time, n) {
			return time*100;
		}, { period: 1/100, duration: .5 })
		.on('end', done)
		.pipe(Speaker())
	});
});


describe('Other', function () {
	it('Errors in processing, throw errors', function () {

	});

	it('End generation', function () {

	});
});