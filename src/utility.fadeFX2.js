var fadeFX2 = (function (window, document) {
	var _elementStyle = document.createElement('div').style;

	var _vendor = (function () {
		var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
			transform,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			transform = vendors[i] + 'ransition';
			if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
		}

		return false;
	})();

	function _prefixStyle (style) {
		if ( _vendor === false ) return false;
		if ( _vendor === '' ) return style;
		return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
	}

	var transition = _prefixStyle('transition');
	var transform = _prefixStyle('transform');

	_elementStyle = null; // free mem ???

	var fxInstance;

	function fade (options) {
		if ( !fxInstance ) {
			var opt = {
				video: document.querySelector('#stage-videos video'),
				time: 2000,
				color: '#000000',
				autostart: true,
				crossFade: true,
				autoplay: true,
				source: {}
			};

			for ( var i in options ) {
				opt[i] = options[i];
			}

			fxInstance = new TransitionFade(opt);
		}

		return fxInstance;
	}

	function TransitionFade (options) {
		this.options = options;

		this.video = this.options.video;
		this.videoIncoming = this.options.incoming;

		this.servo = document.getElementById('fxHelper');

		this.servo.style[transition] = 'opacity 0ms';
		this.servo.style.left = '0px';
		this.servo.style.opacity = '0';
		this.servo.style.backgroundColor = this.options.color;

		if ( this.options.autostart ) {
			this.start();
		}
	}

	TransitionFade.prototype.handleEvent = function (e) {
		switch ( e.type ) {
			case 'transitionend':
			case 'webkitTransitionEnd':
			case 'oTransitionEnd':
			case 'MSTransitionEnd':
				this.transitionEnd(e);
				break;
			case 'canplay':
			console.log('test')
				this.videoReady();
				break;
		}
	};

	TransitionFade.prototype.start = function () {
		this.phase = 'fadeOut';

		this.servo.addEventListener('transitionend', this, false);
		this.servo.addEventListener('webkitTransitionEnd', this, false);
		this.servo.addEventListener('oTransitionEnd', this, false);
		this.servo.addEventListener('MSTransitionEnd', this, false);

		var trick = this.servo.offsetHeight;	// force refresh. Mandatory on FF

		this.servo.style[transition] = 'opacity ' + this.options.time + 'ms';

		var that = this;
		setTimeout(function () {
			that.servo.style.opacity = '1';
		}, 0);
	};

	TransitionFade.prototype.transitionEnd = function (e) {
		e.stopPropagation();

		this.servo.removeEventListener('transitionend', this, false);
		this.servo.removeEventListener('webkitTransitionEnd', this, false);
		this.servo.removeEventListener('oTransitionEnd', this, false);
		this.servo.removeEventListener('MSTransitionEnd', this, false);

		this.video.pause();

		if ( this.phase == 'fadeOut' ) {
			if ( this.options.onFadeOutEnd ) {
				this.options.onFadeOutEnd.call(this);
			}

			if ( this.options.crossFade ) {
				this.phase = 'waiting';
				this.video.addEventListener('canplay', this, false);

				var source, i;
				var el = this.video.querySelectorAll('source');
				for ( i = this.options.source.length-1; i >= 0; i-- ) {
					source = document.createElement('source');
					source.src = this.options.source[i].src;
					source.type = this.options.source[i].type;
					this.video.appendChild(source);
					//html += '<source src="' + this.options.source[i].src + '" type=\'' + this.options.source[i].type + '\'>';
				}

				//this.video.innerHTML = html;
				console.log(this.video.innerHTML)
			}
		} else if ( this.phase == 'fadeIn' ) {
			if ( this.options.onFadeInEnd ) {
				this.options.onFadeInEnd.call(this);
			}

			this.destroy();
		}
	};

	TransitionFade.prototype.videoReady = function () {
		this.video.removeEventListener('canplay', this, false);
		this.fadeIn();
	};

	TransitionFade.prototype.fadeIn = function () {
		this.phase = 'fadeIn';

		this.servo.addEventListener('transitionend', this, false);
		this.servo.addEventListener('webkitTransitionEnd', this, false);
		this.servo.addEventListener('oTransitionEnd', this, false);
		this.servo.addEventListener('MSTransitionEnd', this, false);

		if ( this.options.autoplay ) {
			this.video.play();
		}

		this.servo.style.opacity = '0';
	};

	TransitionFade.prototype.destroy = function () {
		this.video.removeEventListener('canplay', this, false);

		this.servo.removeEventListener('transitionend', this, false);
		this.servo.removeEventListener('webkitTransitionEnd', this, false);
		this.servo.removeEventListener('oTransitionEnd', this, false);
		this.servo.removeEventListener('MSTransitionEnd', this, false);

		this.servo.style[transition] = 'opacity 0ms';
		this.servo.style.opacity = '0';
		this.servo.style.left = '-9999px';

		fxInstance = null;
	};

	return fade;
})(window, document);