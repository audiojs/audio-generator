# audio-generator [![Build Status](https://travis-ci.org/audiojs/audio-generator.svg?branch=master)](https://travis-ci.org/audiojs/audio-generator) [![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

Generate audio stream with a function.

## Usage

[![npm install audio-generator](https://nodei.co/npm/audio-generator.png?mini=true)](https://npmjs.org/package/audio-generator/)


```js
var Generator = require('audio-generator');
var Speaker = require('audio-speaker');

Generator(
	//Generator function, returns sample values -1..1 for channels
	function (time) {
		return [
			Math.sin(Math.PI * 2 * time * 439), //channel 1
			Math.sin(Math.PI * 2 * time * 441), //channel 2
		]
	},

	{
		//Duration of generated stream, in seconds, after which stream will end.
		duration: Infinity,

		//Periodicity of the time.
		period: Infinity
})
.on('error', function (e) {
	//error happened during generation the frame
})
.setFunction(function (time, n) {
	return [Math.random(), Math.random()];
})
.pipe(Speaker());
```

## Related

> [audio-through](http://npmjs.org/package/audio-through) — universal audio processing stream.<br/>
> [audio-speaker](http://npmjs.org/package/audio-speaker) — output audio stream to speaker, both in node/browser.<br/>
> [baudio](http://npmjs.org/package/baudio), [webaudio](http://npmjs.org/package/webaudio) — alternative audio generators.
