/**
 * <audio-generator> HTML element.
 *
 * It does not export anything as it is not a module, it is pre-cooked web-component.
 *
 * To make it work, browserify bundle first with dependencies:
 * `browserify -r audio-generator -r audio-element -o deps.js`
 * and connect it before the import link:
 * <script src="deps.js"></script>
 * <link rel="import" href="./node_modules/audio-generator"/>
 *
 * @module audio-generator/element
 */

var Generator = require('audio-generator');
var parseStack = require('stacktrace-parser').parse;
var AudioElement = require('audio-element');
var fnbody = require('fnbody');
var CodeMirror = require('codemirror');
var cmMode = require('codemirror/mode/javascript/javascript');


var GenProto = Object.create(AudioElement.prototype);


/** Connection logic */
GenProto.numberOfOutputs = 1;
GenProto.numberOfInputs = 0;


/** Meta */
GenProto.label = 'Generator';
GenProto.description = 'Generate audio with function';
GenProto.thumbnail = 'f(t)';


/** Constructor */
GenProto.createdCallback = function () {
	var self = this;

	var duration = parseFloat(this.getAttribute('duration')) || Infinity;

	//create stream
	this.stream = Generator({
		duration: duration
	});

	//create element content
	this.innerHTML = 'function (time) {' +
	'<textarea class="audio-generator-code" rows="10" data-generator-code></textarea>' +
	'}' +
	'<output class="audio-generator-error" data-generator-error></output>';

	//show code in textarea
	var textarea = this.querySelector('[data-generator-code]');
	textarea.value = fnbody(this.stream.generate);

	var error = this.querySelector('[data-generator-error]');

	//create codemirror wrapper over the textarea
	var codemirror = this.codemirror = CodeMirror.fromTextArea(textarea, {
		node: {name: "javascript", json: true},
		viewportMargin: Infinity,
		lineNumbers: true
	});
	codemirror.setValue(textarea.value);

	//update stream on changing function code
	codemirror.on('change', function (i, ch) {
		var src = codemirror.getValue();

		//clear error
		error.value = '';

		//reset function
		self.stream.setFunction(src);
	});

	//show error message, if any
	this.stream.on('generror', function (e) {
		//find the line of a code
		var stack = parseStack(e.stack);

		var evalOffset = 2;

		var message = e.message + ' at ' + (stack[0].lineNumber - evalOffset) + ':' + stack[0].column;

		error.value = message;
	});

	//refresh codemirror - it is updated on DOMContentLoaded
	window.addEventListener('load', function () {
		codemirror.refresh();
	});

	AudioElement.prototype.createdCallback.call(this);
};


/** Provide element */
document.registerElement('audio-generator', { prototype: GenProto });