
var HAP = {};

HAP.init = (function (window, document) {

	var player;
	var projector;
	var stage;
	var transcript;

	var sidemenu;

	var mixTitle;
	var saveButton;
	var savingAnim;

	var fade;
	var trim;
	var title;

	var mixId = HA.getURLParameter('m');

	function loaded () {

		// Init the API utility
		HA.api.init();

		player = HA.Player({
			target: "#video-source",
			gui: true
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

		mixTitle = document.getElementById('mix-title');
		saveButton = document.getElementById('save-button');
		savingAnim = document.querySelector('#save-button-saving');

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

		// Title
		mixTitle.addEventListener('change', function(e) {
			stage.mixDetails({
				title: this.value
			});
		});
		stage.target.addEventListener(HA.event.load, function(e) {
			mixTitle.value = HA.api.mix.label;
		});
		stage.target.addEventListener(HA.event.save, function(e) {
			savingAnim.style.display = 'none';
		});

		// Save button
		saveButton._tap = new HA.Tap({el: saveButton});
		saveButton.addEventListener('tap', function () {
			savingAnim.style.display = 'block';
			stage.save();
		}, false);

		// Prompt login if attempting to save
		var signin = document.querySelector('#signin-modal');

		signin.querySelector('.modal-close').addEventListener('click', function(e) {
			e.preventDefault();
			signin.style.display = 'none';
		});

		signin.querySelector('#signin-form').addEventListener('submit', function(e) {
			e.preventDefault();
			signin.style.display = 'none';
			savingAnim.style.display = 'block';
			HA.api.signin({
				username: signin.querySelector('#username').value,
				password: signin.querySelector('#password').value
			}, function(success) {
				if(success) {
					// try and save again
					stage.save();
				} else {
					// Show the prompt again
					signin.style.display = 'block';
					savingAnim.style.display = 'none';
				}
			});
		});

		stage.target.addEventListener(HA.event.unauthenticated, function(e) {
			// Prompt login
			signin.style.display = 'block';
			// Hide saving anim
			savingAnim.style.display = 'none';
		});

		// Init special fx
		fade = new HA.DragDrop({
			handle: '#fadeFX',
			dropArea: stage.target, 
			draggableClass: 'draggableEffect',
			onDragStart: function (e) {
				HA.addClass(stage.target, 'dragdrop');
			},
			onDrop: function (el) {
				HA.removeClass(stage.target, 'dragdrop');
				if ( !el ) {
					return;
				}
				el.setAttribute('data-effect', 'fade');
				el.className += ' effect';
				el.innerHTML = '<form onsubmit="return false"><label>Fade Effect: <span class="value">1</span>s</label><input id="effect-duration" type="range" value="1" min="0.5" max="5" step="0.1" onchange="this.setAttribute(\'value\', this.value); this.previousSibling.querySelector(\'span\').innerHTML = this.value;"></form>';
				stage.dropped(el, 'Fade');
			}
		});

		trim = new HA.DragDrop({
			handle: '#trimFX',
			dropArea: stage.target,
			draggableClass: 'draggableEffect',
			onDragStart: function (e) {
				HA.addClass(stage.target, 'dragdrop');
			},
			onDrop: function (el) {
				HA.removeClass(stage.target, 'dragdrop');
				if ( !el ) {
					return;
				}
				el.setAttribute('data-effect', 'trim');
				el.className += ' effect';
				el.innerHTML = '<form onsubmit="return false"><label>Trim: <span class="value">1</span>s</label><input id="effect-duration" type="range" value="1" min="0" max="5" step="0.1" onchange="this.setAttribute(\'value\', this.value); this.previousSibling.querySelector(\'span\').innerHTML = this.value;"></form>';
				stage.dropped(el, 'Trim');
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
				HA.removeClass(stage.target, 'dragdrop');
				if ( !el ) {
					return;
				}
				el.setAttribute('data-effect', 'title');
				el.className += ' effect';
				el.innerHTML = '<form onsubmit="return false"><label>Title: <span class="value">1</span>s</label><input id="effect-title" type="text" value="Title" onchange="this.setAttribute(\'value\', this.value);"><input id="effect-duration" type="range" value="1" min="0.5" max="5" step="0.1" onchange="this.setAttribute(\'value\', this.value); this.previousSibling.querySelector(\'span\').innerHTML = this.value;"></form>';
				stage.dropped(el, 'Title');
			}
		});

		if(mixId) {
			stage.load(mixId);
		}
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