Generate PCM audio stream with function.

[`npm install audio-generator`](https://npmjs.org/package/audio-generator)

```js
var Generator = require('audio-generator');
var Speaker = require('node-speaker');

Generator(function (time) {
	return Math.sin(Math.PI * 2 * time * 440);
})
.on('generror', function (e) {
	//error happened during generation the frame.
});
.pipe(Speaker());
```

## Options

```js
var generator = new Generator({
	//Generator function, returns sample values -1..1 for channels
	generate: function (time) {
		return [Math.random(), Math.random()]
	},

	//Duration of the generated audio, in seconds. Default is Infinity.
	duration: 2,

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
```

## Related

* [pcm-format](http://npmjs.org/package/pcm-format) — transform output pcm-stream to desired format.
* [audio-speaker](http://npmjs.org/package/audio-speaker) — output pcm stream to speaker in browser and node.
* [node-speaker](http://npmjs.org/package/speaker), [alsa](http://npmjs.org/package/alsa) — output pcm stream to speaker in node.
* [baudio](http://npmjs.org/package/baudio), [webaudio](http://npmjs.org/package/webaudio) — alternative audio generators based on function.