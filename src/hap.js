/* Hyperaudio Pad */

HAP = (function (window, document, HA) {

	var HAP = {
		options: {
			viewer: false, // True for read only viewer
			targetViewer: '#viewer-wrapper',
			editBtn: '#edit-button',
			shareBtn: '#share-button',
			defaultTranscriptId: 'XMVjtXOUSC-V0sSZBOKrBw',
			ga_origin: 'Pad'
		}
	};

	var player;
	var projector;
	var music;
	var stage;
	var transcript;

	var sidemenu;

	var editBtn;
	var shareBtn;

	var share;
	var shareTextElem;

	var mixTitleForm;
	var mixTitle;
	var mixTitleHandler;
	var saveButton;
	var savingAnim;

	var signin;

	var fade;
	var trim;
	var title;

	var namespace = null;
	var domain = 'hyperaud.io';
	var myUrls = {};

	var transcriptId = HA.getURLParameter('t');
	var mixId = HA.getURLParameter('m');

	function updateGUI() {

		myUrls = getUrls();

		if(editBtn) {
			editBtn.setAttribute('href', myUrls.edit);
		}

		if(shareTextElem) {
			var shareText = '<iframe src="' + myUrls.share + '" height="294" width="480" frameborder="0" scrolling="no" allowfullscreen seamless></iframe>';
			shareTextElem.value = shareText;
		}

		if(share && shareBtn) {
			if(mixId || HAP.options.viewer) {
				shareBtn.style.display = 'block';
			} else {
				shareBtn.style.display = 'none';
			}
		}
	}

	function getUrls() {
		var edit = 'http://' + (namespace ? namespace + '.' : '') + domain + '/pad/';
		var share = edit + 'viewer/';
		var params = '';
		if(mixId && transcriptId) {
			params = '?t=' + transcriptId + '&m=' + mixId;
		} else if(mixId) {
			params = '?m=' + mixId;
		} else if(transcriptId) {
			params = '?t=' + transcriptId;
		}
		edit += params;
		share += params;

		return {
			edit: edit,
			share: share
		};
	}

	function loaded () {
		
		if (document.location.hostname.indexOf('hyperaud') > -1) {
			namespace = document.location.hostname.substring(0, document.location.hostname.indexOf('hyperaud') - 1);
		}

		if (document.location.hostname.indexOf('hyperaudio.net') > -1) {
			domain = 'hyperaudio.net';
		}

		// Init the API utility
		HA.api.init({
			org: namespace, // The organisations namespace / sub-domain. EG. 'chattanooga'
			domain: domain
		});

		// Init the Clipboard utility
		HA.Clipboard.init();

		// Init the Address utility
		HA.Address.init();

		editBtn = document.querySelector(HAP.options.editBtn);
		shareBtn = document.querySelector(HAP.options.shareBtn);

		share = document.querySelector('#share-modal');
		shareTextElem = document.querySelector('#share-embed-code');

		mixTitleForm = document.getElementById('mix-title-form');
		mixTitle = document.getElementById('mix-title');
		saveButton = document.getElementById('save-button');
		savingAnim = document.querySelector('#save-button-saving');

		signin = document.querySelector('#signin-modal');

		music = HA.Music({
			target: "#music-player"
		});

		if(!HAP.options.viewer || transcriptId || mixId) {

			if(!HAP.options.viewer || mixId) {
				projector = HA.Projector({
					target: "#stage-videos",
					music: music
				});

				stage = HA.Stage({
					target: "#stage",
					projector: projector,
					editable: !HAP.options.viewer
				});

				stage.target.addEventListener(HA.event.load, function(e) {
					if(!HAP.options.viewer) {
						mixTitle.value = HA.api.mix.label;
						notify('load'); // Tell top frame the mix was loaded
					} else {
						mixTitle.innerHTML = HA.api.mix.label;
					}
					mixId = HA.api.mix._id;
					updateGUI();
				}, false);

				if(!HAP.options.viewer) {
					stage.target.addEventListener(HA.event.save, function(e) {
						savingAnim.style.display = 'none';
						notify('save'); // Tell top frame the mix was saved
						mixId = HA.api.mix._id;
						updateGUI();
					}, false);
				}
			}

			if(!HAP.options.viewer || (transcriptId && !mixId)) {
				player = HA.Player({
					target: "#video-source",
					gui: {
						fullscreen: HAP.options.viewer
					}
				});

				transcript = HA.Transcript({
					target: "#transcript",
					stage: stage,
					player: player
				});

				if(HAP.options.viewer) {
					transcript.target.addEventListener(HA.event.load, function(e) {
						mixTitle.innerHTML = HA.api.transcript.label;
					}, false);
				}
				transcript.target.addEventListener(HA.event.load, function(e) {
					transcriptId = HA.api.transcript._id;
					updateGUI();
				}, false);
			}
		}

		if(!HAP.options.viewer) {

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

			// Title handler
			mixTitleHandler = function(e) {
				e.preventDefault();
				stage.mixDetails({
					title: mixTitle.value
				});
				if(typeof mixTitle.blur === 'function') {
					mixTitle.blur();
				}
				HA.gaEvent({
					origin: HAP.options.ga_origin,
					type: 'HAP',
					action: 'titlechange: Mix title changed'
				});
			};

			// Title
			mixTitleForm.addEventListener('submit', mixTitleHandler, false);
			mixTitleForm.addEventListener('change', mixTitleHandler, false);
			mixTitle.addEventListener('keyup', function(e) {
				stage.mixDetails({
					title: this.value
				});
			}, false);

			// Save button
			saveButton._tap = new HA.Tap({el: saveButton});
			saveButton.addEventListener('tap', function () {
				savingAnim.style.display = 'block';
				stage.save();
			}, false);

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
						notify('login'); // Tell top frame the user has logged in.
						stage.save();
					} else {
						// Show the prompt again
						signin.style.display = 'block';
						savingAnim.style.display = 'none';
					}
				});
			});

			// Prompt login if attempting to save
			stage.target.addEventListener(HA.event.unauthenticated, function(e) {
				// Prompt login
				signin.style.display = 'block';
				// Hide saving anim
				savingAnim.style.display = 'none';
				notify('unauthenticated'); // Tell top frame the user is not logged in.
			});

			stage.target.addEventListener(HA.event.change, function(e) {
				notify('change'); // Tell top frame the mix (may have) changed
			});

			// Init special fx
			fade = new HA.DragDrop({
				handle: '#fadeFX',
				dropArea: stage.target, 
				draggableClass: 'draggableEffect',
				onDragStart: function (e) {
					HA.addClass(stage.target, 'dragdrop');
					HA.gaEvent({
						origin: HAP.options.ga_origin,
						type: 'HAP',
						action: 'fadeeffectstartdrag: Start drag of Fade effect'
					});
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
					HA.gaEvent({
						origin: HAP.options.ga_origin,
						type: 'HAP',
						action: 'fadeeffectdrop: Drop Fade effect on to stage'
					});
				}
			});

			trim = new HA.DragDrop({
				handle: '#trimFX',
				dropArea: stage.target,
				draggableClass: 'draggableEffect',
				onDragStart: function (e) {
					HA.addClass(stage.target, 'dragdrop');
					HA.gaEvent({
						origin: HAP.options.ga_origin,
						type: 'HAP',
						action: 'trimeffectstartdrag: Start drag of Trim effect'
					});
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
					HA.gaEvent({
						origin: HAP.options.ga_origin,
						type: 'HAP',
						action: 'trimeffectdrop: Drop Trim effect on to stage'
					});
				}
			});

			title = new HA.DragDrop({
				handle: '#titleFX',
				dropArea: stage.target,
				draggableClass: 'draggableEffect',
				onDragStart: function (e) {
					HA.addClass(stage.target, 'dragdrop');
					HA.gaEvent({
						origin: HAP.options.ga_origin,
						type: 'HAP',
						action: 'titleeffectstartdrag: Start drag of Title effect'
					});
				},
				onDrop: function (el) {
					HA.removeClass(stage.target, 'dragdrop');
					if ( !el ) {
						return;
					}
					el.setAttribute('data-effect', 'title');
					el.className += ' effect';
					var html = '<form onsubmit="return false">' +
						'<label>Title: <span class="value">1</span>s</label>' +
						'<div class="effect-checkboxes"><label for="effect-fullscreen">Full Screen:</label> <input type="checkbox" id="effect-fullscreen" checked onchange="if(this.checked) { this.setAttribute(\'checked\', true); } else { this.removeAttribute(\'checked\'); }"></div>' +
						'<input id="effect-title" type="text" value="Title" onchange="this.setAttribute(\'value\', this.value);" onkeyup="this.setAttribute(\'value\', this.value);">' +
						'<input id="effect-duration" type="range" value="1" min="0.5" max="5" step="0.1" onchange="this.setAttribute(\'value\', this.value); this.parentNode.querySelector(\'span\').innerHTML = this.value;">' +
						'</form>';

					// el.innerHTML = '<form onsubmit="return false"><label>Title: <span class="value">1</span>s</label><input id="effect-title" type="text" value="Title" onchange="this.setAttribute(\'value\', this.value);"><input id="effect-duration" type="range" value="1" min="0.5" max="5" step="0.1" onchange="this.setAttribute(\'value\', this.value); this.parentNode.querySelector(\'span\').innerHTML = this.value;"></form>';
					el.innerHTML = html;
					stage.dropped(el, 'Title');
					HA.gaEvent({
						origin: HAP.options.ga_origin,
						type: 'HAP',
						action: 'titleeffectdrop: Drop Title effect on to stage'
					});
				}
			});
		}

		if(share && shareBtn) {
			share.querySelector('.modal-close').addEventListener('click', function(e) {
				e.preventDefault();
				share.style.display = 'none';
				HA.Clipboard.enable(); // Enable the Clipboard utility
			});

			share.querySelector('form').addEventListener('submit', function(e) {
				e.preventDefault();
				share.style.display = 'none';
				HA.Clipboard.enable(); // Enable the Clipboard utility
			});

			shareBtn.addEventListener('click', function(e) {
				e.preventDefault();
				share.style.display = 'block';
				HA.Clipboard.disable(); // Disable the Clipboard utility
			});
		}

		if(shareTextElem) {
			shareTextElem.addEventListener('click', function(e) {
				e.preventDefault();
				shareTextElem.focus();
				shareTextElem.select();
			}, false);
		}

		updateGUI();

		if(!HAP.options.viewer || transcriptId || mixId) {

			if(!HAP.options.viewer || mixId) {
				if(mixId) {
					HA.gaEvent({
						origin: HAP.options.ga_origin,
						type: 'HAP',
						action: 'loadmix: Load Mix given in URL param'
					});
					stage.load(mixId);
				} else {
					HA.gaEvent({
						origin: HAP.options.ga_origin,
						type: 'HAP',
						action: 'nomix: New pad opened'
					});
				}
			}

			if(!HAP.options.viewer || (transcriptId && !mixId)) {
				if(transcriptId) {
					HA.gaEvent({
						origin: HAP.options.ga_origin,
						type: 'HAP',
						action: 'loadtranscript: Load Transcript given in URL param'
					});
					transcript.load(transcriptId);
				} else {
					HA.gaEvent({
						origin: HAP.options.ga_origin,
						type: 'HAP',
						action: 'loaddefaulttranscript: Load default Transcript'
					});
					transcript.load(HAP.options.defaultTranscriptId);
				}
			}
		}
	}

	function notify(type) {
		try {
			var topFrame = window.top;
			if(typeof topFrame.notify === 'function') {
				topFrame.notify(type);
			}
		} catch(error) {}
	}

/*
	// Not sure if this findDraggable() function is ever called.
	function findDraggable (el) {
		return (/(^|\s)item($|\s)/).test(el.className) ? el : false;
	}
*/

	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

	var pageReady = false;
	window.addEventListener('load', function() {
		pageReady = true;
	}, false);

	HAP.init = function(options) {

		this.options = HA.extend({}, this.options, options);

		if(this.options.viewer) {
			var viewer = document.querySelector(this.options.targetViewer);
			var video = document.createElement('div');
			var text = document.createElement('div');
			if(mixId) {
				video.setAttribute('id', 'stage-videos');
				HA.addClass(video, 'video');
				text.setAttribute('id', 'stage');
			} else {
				video.setAttribute('id', 'video-source');
				HA.addClass(video, 'video');
				text.setAttribute('id', 'transcript');
				text.appendChild(document.createElement('p')); // Otherwise iScroll complains.
			}
			viewer.appendChild(video);
			viewer.appendChild(text);
		}

		if(pageReady) {
			loaded();
		} else {
			window.addEventListener('load', loaded, false);
		}
	};

	return HAP;

})(window, document, HA);