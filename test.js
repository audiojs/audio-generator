var Generator = require('./');
var Speaker = require('speaker');

var generator = Generator({
	generate: function (time) {
		// return Math.sin(Math.PI * 2 * time * 440) * 32760;
		// return Math.random() * 32760;
		return [Math.random() * 30000, Math.random() * 30000];
	},
	duration: 10
});

var speaker = Speaker();

generator.pipe(speaker);