var Generator = require('./');
var Speaker = require('speaker');
var PCMFormat = require('audio-pcm-format');

var generator = Generator({
	generate: function (time) {
		// return Math.sin(Math.PI * 2 * time * 440);
		// return Math.random();
		// return [Math.random(), Math.random()];
		return [Math.sin(Math.PI * 2 * time * 439), Math.sin(Math.PI * 2 * time * 441)];
	},
	duration: 10
});

var speaker = Speaker();

generator.pipe(speaker);