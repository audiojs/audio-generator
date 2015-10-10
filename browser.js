/**
 * GUI for audio-generator
 */

var parseStack = require('stacktrace-parser');



/** Audio-lab rendering settings */
Generator.prototype.numberOfOutputs = 1;
Generator.prototype.numberOfInputs = 0;
Generator.title = 'Generator';



/** GUI */
var fnbody = require('fnbody');

Generator.prototype.createElement = function (container) {
	var self = this;

	var CodeMirror = require('codemirror');
	var cmMode = require('codemirror/mode/javascript/javascript');
	var isFn = require('is-function');
	var on = require('emmy/on');
	var off = require('emmy/off');
	var q = require('queried');
	var autosize = require('autosize');
	var domify = require('domify');

	//create element content
	var element = domify(`
		function (time) {
		<textarea class="block-code" rows="10" data-generator-code></textarea>
		}
		<output class="block-error-message" data-generator-error></output>
	`);
	container.appendChild(element);

	//show code in textarea
	var textarea = q('[data-generator-code]', container);
	textarea.value = fnbody(self.generate);

	var error = q('[data-generator-error]', container);

	//create codemirror wrapper over the textarea
	var codemirror = CodeMirror.fromTextArea(textarea, {
		node: {name: "javascript", json: true},
		value: textarea.value,
		viewportMargin: Infinity,
		lineNumbers: true
	});

	//attach processor
	setFunction(self.generate, true);

	on(codemirror, 'change', function (i, ch) {
		var src = codemirror.getValue();
		setFunction(src);

		error.value = '';
	});

	//show error message, if any
	on(self, 'generror', function (e) {
		//find the line of a code
		var stack = parse(e.stack);

		var evalOffset = 2;

		error.value = e.message + ' at ' + (stack[0].lineNumber - evalOffset) + ':' + stack[0].column;
	});

	return element;


	/** Set new generator function */
	function setFunction (fn, setValue) {
		var self = this;

		try {
			if (typeof fn === 'string') {
				//allow strange syntax
				// fn = fn.replace(/\n\s*/g, '\n');
				fn = new Function ('time', fn);
			}

			var value = fnbody(fn);

			setValue && codemirror.setValue(value);

			self.generate = fn;

			//clear error state
			self.isGenError = false;

			self.emit('change');

		} catch (e) {
			self.emit('generror', e);
		}

		return self;
	};
}



/** Serialization */
Generator.prototype.toJSON = function () {
	return {
		generate: fnbody(this.generate)
	};
}
