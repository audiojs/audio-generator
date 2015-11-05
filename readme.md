Generate audio stream with a function.

## Usage

[![npm install audio-generator](https://nodei.co/npm/audio-generator.png?mini=true)](https://npmjs.org/package/audio-generator/)


```js
var Generator = require('audio-generator');
var Speaker = require('node-speaker');

var generator = Generator({
	//Generator function, returns sample values -1..1 for channels
	generate: function (time, n) {
		return [Math.sin(Math.PI * 2 * time * 439), Math.sin(Math.PI * 2 * time * 441)];
	},

	//Duration of generated stream, in seconds
	duration: Infinity,

	//PCM output format settings
	channels: 2,
	sampleRate: 44100,
	byteOrder: 'LE',
	bitDepth: 16,
	signed: true,
	float: false,
	samplesPerFrame: 64,
	interleaved: true
});

generator.on('generror', function (e) {
	//error happened during generation the frame
})
.pipe(Speaker());


//change generator function
generator.setFunction(function (time, n) {
	return [Math.random(), Math.random()];
});
```

## Related

> [audio-processor](http://npmjs.org/package/audio-processor) — perform processing of an audio data with a function.<br/>
> [audio-pcm-format](http://npmjs.org/package/audio-pcm-format) — transform output pcm-stream to desired format.<br/>
> [audio-speaker](http://npmjs.org/package/audio-speaker) — output pcm stream to speaker in browser and node.<br/>
> [node-speaker](http://npmjs.org/package/speaker), [alsa](http://npmjs.org/package/alsa) — output pcm stream to speaker in node.<br/>
> [baudio](http://npmjs.org/package/baudio), [webaudio](http://npmjs.org/package/webaudio) — alternative audio generators based on function.