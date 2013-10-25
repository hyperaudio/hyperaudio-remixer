
var HAP = {};

HAP.init = (function (window, document) {

	var player;
	var projector;
	var stage;
	var transcript;

	var sidemenu;
	var saveButton;

	var fade;
	var pause;
	var title;

	function loaded () {

		// Init the API utility
		HA.api.init();

		player = HA.Player({
			target: "#video-source",
			guiNative: true
		});

		projector = HA.Projector({
			target: "#stage-videos"
		});

		stage = HA.Stage({
			target: "#stage",
			projector: projector
		});

		transcript = HA.Transcript({
			target: "#transcript",
			stage: stage,
			player: player
		});

		saveButton = document.getElementById('save-button');

		function mediaSelect (el) {
			var id = el.getAttribute('data-id');
			sidemenu.close();
			transcript.load(id);
		}

		// Init the side menu
		sidemenu = new HA.SideMenu({
			el: '#sidemenu',
			stage: stage,
			callback: mediaSelect
		});

		// Save button
		saveButton._tap = new HA.Tap({el: saveButton});
		saveButton.addEventListener('tap', function () {
			stage.save();
/*
			// this is just for testing
			HA.titleFX({
				el: '#titleFXHelper',
				text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,'
			});
*/
		}, false);

		// Init special fx
		fade = new HA.DragDrop({
			handle: '#fadeFX',
			dropArea: stage.target, 
			draggableClass: 'draggableEffect',
			onDragStart: function (e) {
				HA.addClass(stage.target, 'dragdrop');
			},
			onDrop: function (el) {
				if ( !el ) {
					return;
				}
				el.className += ' effect';
				el.innerHTML = '<form><label>Fade Effect: <span class="value">1</span>s</label><input type="range" value="1" min="0.5" max="5" step="0.1" onchange="this.parentNode.querySelector(\'span\').innerHTML = this.value"></form>';
				stage.dropped(el, 'Fade');
			}
		});

		pause = new HA.DragDrop({
			handle: '#pauseFX',
			dropArea: stage.target,
			draggableClass: 'draggableEffect',
			onDragStart: function (e) {
				HA.addClass(stage.target, 'dragdrop');
			},
			onDrop: function (el) {
				if ( !el ) {
					return;
				}
				el.className += ' effect';
				el.innerHTML = '<form><label>Pause: <span class="value">1</span>s</label><input type="range" value="1" min="0.5" max="5" step="0.1" onchange="this.parentNode.querySelector(\'span\').innerHTML = this.value"></form>';
				stage.dropped(el, 'Pause');
			}
		});

		title = new HA.DragDrop({
			handle: '#titleFX',
			dropArea: stage.target,
			draggableClass: 'draggableEffect',
			onDragStart: function (e) {
				HA.addClass(stage.target, 'dragdrop');
			},
			onDrop: function (el) {
				if ( !el ) {
					return;
				}
				el.className += ' effect';
				el.innerHTML = '<form><label>Title: <span class="value">1</span>s</label><input type="text" value="Title"><input type="range" value="1" min="0.5" max="5" step="0.1" onchange="this.parentNode.querySelector(\'span\').innerHTML = this.value"></form>';
				stage.dropped(el, 'Title');
			}
		});
	}

	// kickstart
	function init () {
		// nothing to do
	}

	// Not sure if this findDraggable() function is ever called.
	function findDraggable (el) {
		return (/(^|\s)item($|\s)/).test(el.className) ? el : false;
	}

	window.addEventListener('load', loaded, false);
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

	return init;

})(window, document);