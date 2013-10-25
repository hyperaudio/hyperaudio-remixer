
var APP = {};

APP.editBlock = function (e) {
	e.stopPropagation();
	this.parentNode._editBlock = new EditBlock({el: this.parentNode});
};

// Used to reorder already dropped excerpt
APP.dropped = function (el, html) {
	var actions;
	var draggableClass = '';
	var stage = document.getElementById('stage');

	stage.className = '';

	// add edit action if needed
	if ( !(/(^|\s)effect($|\s)/.test(el.className)) ) {
		actions = el.querySelector('.actions');
		actions._tap = new Tap({el: actions});
		actions.addEventListener('tap', APP.editBlock, false);
	} else {
		draggableClass = 'draggableEffect';
	}

	el._dragInstance = new DragDrop({
		handle: el,
		dropArea: stage,

		html: html,
		draggableClass: draggableClass,
		onDragStart: function () {
			stage.className = 'dragdrop';
		},
		onDrop: function () {
			stage.className = '';
		}
	});
};

APP.init = (function (window, document) {

	var textselect;
	var sidemenu;
	var stage;
	var saveButton;

	var fade;
	var pause;
	var title;

	var videoSource;
	var videoStage;

	function loaded () {
		stage = document.getElementById('stage');
		videoSource = document.querySelector('#video-source video');
		saveButton = document.getElementById('save-button');

		// Init the main text selection
		textselect = new WordSelect({
			el: '#transcript',
			addHelpers: false,
			onDragStart: function (e) {
				stage.className = 'dragdrop';

				var dragdrop = new DragDrop({
					dropArea: stage,
					init: false,
					onDrop: function (el) {
						textselect.clearSelection();
						this.destroy();
						if ( !el ) {
							return;
						}
						APP.dropped(el);
					}
				});

				var html = this.getSelection().replace(/ class="[\d\w\s\-]*\s?"/gi, '') + '<div class="actions"></div>';
				dragdrop.init(html, e);
			}
		});

		// Init the side menu
		sidemenu = new SideMenu({
			el: '#sidemenu',
			callback: mediaSelect
		});

		// Save button
		saveButton._tap = new Tap({el: saveButton});
		saveButton.addEventListener('tap', function () {
			// this is just for testing
			titleFX({
				el: '#titleFXHelper',
				text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,'
			});
		}, false);

		// Init special fx
		fade = new DragDrop({
			handle: '#fadeFX',
			dropArea: stage, 
			draggableClass: 'draggableEffect',
			onDragStart: function (e) {
				stage.className = 'dragdrop';
			},
			onDrop: function (el) {
				if ( !el ) {
					return;
				}
				el.className += ' effect';
				el.innerHTML = '<form><label>Fade Effect: <span class="value">1</span>s</label><input type="range" value="1" min="0.5" max="5" step="0.1" onchange="this.parentNode.querySelector(\'span\').innerHTML = this.value"></form>';
				APP.dropped(el, 'Fade');
			}
		});

		pause = new DragDrop({
			handle: '#pauseFX',
			dropArea: stage,
			draggableClass: 'draggableEffect',
			onDragStart: function (e) {
				stage.className = 'dragdrop';
			},
			onDrop: function (el) {
				if ( !el ) {
					return;
				}
				el.className += ' effect';
				el.innerHTML = '<form><label>Pause: <span class="value">1</span>s</label><input type="range" value="1" min="0.5" max="5" step="0.1" onchange="this.parentNode.querySelector(\'span\').innerHTML = this.value"></form>';
				APP.dropped(el, 'Pause');
			}
		});

		title = new DragDrop({
			handle: '#titleFX',
			dropArea: stage,
			draggableClass: 'draggableEffect',
			onDragStart: function (e) {
				stage.className = 'dragdrop';
			},
			onDrop: function (el) {
				if ( !el ) {
					return;
				}
				el.className += ' effect';
				el.innerHTML = '<form><label>Title: <span class="value">1</span>s</label><input type="text" value="Title"><input type="range" value="1" min="0.5" max="5" step="0.1" onchange="this.parentNode.querySelector(\'span\').innerHTML = this.value"></form>';
				APP.dropped(el, 'Title');
			}
		});
	}

	// kickstart
	function init () {
		// nothing to do
	}

	function mediaSelect (el) {
		var source = el.getAttribute('data-source');

		document.getElementById('source-mp4').src = 'videos/' + source + '.mp4';
		document.getElementById('source-webm').src = 'videos/' + source + '.webm';
		videoSource.load();
	}

	function findDraggable (el) {
		return (/(^|\s)item($|\s)/).test(el.className) ? el : false;
	}

	window.addEventListener('load', loaded, false);
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

	return init;

})(window, document);