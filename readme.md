Generate audio stream with a function.

## Usage

[![npm install audio-generator](https://nodei.co/npm/audio-generator.png?mini=true)](https://npmjs.org/package/audio-generator/)


```js
var Generator = require('audio-generator');
var Speaker = require('audio-speaker');

Generator(
	//Generator function, returns sample values -1..1 for channels
	function (chunk) {
		var time = index / this.sampleRate;

		return Math.sin(Math.PI * 2 * time * 439);
	},

	{
		//Duration of generated stream, in seconds
		duration: Infinity,

		//Periodicity of the time
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

> [audio-processor](http://npmjs.org/package/audio-processor) — perform processing of an audio data with a function.<br/>
> [audio-pcm-format](http://npmjs.org/package/audio-pcm-format) — transform output pcm-stream to desired format.<br/>
> [audio-speaker](http://npmjs.org/package/audio-speaker) — output pcm stream to speaker in browser and node.<br/>
> [node-speaker](http://npmjs.org/package/speaker), [alsa](http://npmjs.org/package/alsa) — output pcm stream to speaker in node.<br/>
> [baudio](http://npmjs.org/package/baudio), [webaudio](http://npmjs.org/package/webaudio) — alternative audio generators based on function.