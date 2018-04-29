'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable class-methods-use-this, no-unused-vars, no-plusplus, no-continue, no-param-reassign */

var Player = function () {
  function Player(rootNodeOrSelector) {
    var _this = this;

    var itemSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.hyperaudio-transcript, .hyperaudio-effect';

    _classCallCheck(this, Player);

    this.itemSelector = itemSelector;
    this.root = typeof rootNodeOrSelector === 'string' ? document.querySelector(rootNodeOrSelector) || document.createElement('section') : rootNodeOrSelector;

    // flow-disable-next-line
    this.root.querySelector(this.itemSelector).parentElement.querySelectorAll(this.itemSelector).forEach(function (item) {
      return _this.setup(item);
    });

    // flow-disable-next-line
    this.root.querySelector(this.itemSelector).parentElement.addEventListener('click', this.onClick.bind(this));
  }

  _createClass(Player, [{
    key: 'setup',
    value: function setup(item) {
      var src = item.getAttribute('data-src');
      var type = item.getAttribute('data-type');

      if (src) this.getMedia(src, type);

      // data-m?
      item.querySelectorAll('*[data-m]').forEach(function (element) {
        var m = element.getAttribute('data-m');
        var d = element.getAttribute('data-d');
        var t = [];

        if (m) t.push(parseInt(m, 10) / 1000);
        if (d) t.push(parseInt(d, 10) / 1000);

        element.setAttribute('data-t', t.join(','));
        element.removeAttribute('data-m');
        element.removeAttribute('data-d');
        element.removeAttribute('class');
        element.parentElement.removeAttribute('class');
      });
    }

    // empty() {
    //   this.root.querySelector(this.itemSelector).parentElement.innerHTML = '';
    //   this.root.querySelector('header').parentElement.innerHTML = '';
    // }

  }, {
    key: 'onClick',
    value: function onClick(event) {
      var t = event.target.getAttribute('data-t');
      if (!t) return;

      var item = event.target.parentElement;
      while (item && !item.matches(this.itemSelector)) {
        item = item.parentElement;
      }if (!item) return;

      var src = item.getAttribute('data-src');
      if (!src) return;

      // FIXME
      // flow-disable-next-line
      var media = this.getMedia(src);
      if (!media) return;

      var _t$split = t.split(','),
          _t$split2 = _slicedToArray(_t$split, 2),
          start = _t$split2[0],
          duration = _t$split2[1];
      // event.target.classList.add('hyperaudio-duration');

      // flow-disable-next-line


      media.currentTime = start;

      // flow-disable-next-line
      if (media.paused) media.play();
    }
  }, {
    key: 'setHead',
    value: function setHead(time, src) {
      var _this2 = this;

      this.currentSrc = src;
      var found = false;

      var items = this.root.querySelectorAll('.hyperaudio-transcript[data-src="' + src + '"]');

      var _loop = function _loop(j) {
        var item = items[j];

        item.querySelectorAll('.hyperaudio-past').forEach(function (active) {
          return active.classList.remove('hyperaudio-past');
        });
        item.querySelectorAll('.hyperaudio-active').forEach(function (active) {
          return active.classList.remove('hyperaudio-active');
        });

        var candidates = item.querySelectorAll('*[data-t]');

        var first = candidates[0];
        var last = candidates[candidates.length - 1];

        // flow-disable-next-line

        var _first$getAttribute$s = first.getAttribute('data-t').split(','),
            _first$getAttribute$s2 = _slicedToArray(_first$getAttribute$s, 1),
            t0 = _first$getAttribute$s2[0];

        if (time < parseFloat(t0)) return 'continue';

        // flow-disable-next-line

        var _last$getAttribute$sp = last.getAttribute('data-t').split(','),
            _last$getAttribute$sp2 = _slicedToArray(_last$getAttribute$sp, 2),
            ti = _last$getAttribute$sp2[0],
            di = _last$getAttribute$sp2[1];

        if (time > parseFloat(ti) + parseFloat(di)) return 'continue';

        found = true;
        _this2.lastSegment = item;

        var _loop2 = function _loop2(i) {
          var tc = candidates[i].getAttribute('data-t');
          // flow-disable-next-line

          var _tc$split = tc.split(','),
              _tc$split2 = _slicedToArray(_tc$split, 2),
              t = _tc$split2[0],
              d = _tc$split2[1];

          t = parseFloat(t);
          d = parseFloat(d);

          if (t < time) {
            candidates[i].classList.add('hyperaudio-past');
          }

          if (t <= time && time < t + d) {
            // console.log(time - (t + d) * 1e3);
            candidates[i].classList.add('hyperaudio-active');
            if (!candidates[i].classList.contains('hyperaudio-duration')) setInterval(function () {
              candidates[i].classList.remove('hyperaudio-duration');
            }, (d - (time - t)) * 1e3);
            candidates[i].classList.add('hyperaudio-duration');
          }

          if (t > time) return 'break';
        };

        for (var i = 0; i < candidates.length; i++) {
          var _ret2 = _loop2(i);

          if (_ret2 === 'break') break;
        }
      };

      for (var j = 0; j < items.length; j++) {
        var _ret = _loop(j);

        if (_ret === 'continue') continue;
      }

      if (!found) {
        // flow-disable-next-line
        var media = this.getMedia(src);
        // flow-disable-next-line
        media.pause();

        var allItems = this.root.querySelectorAll('.hyperaudio-transcript');
        for (var k = 0; k < allItems.length - 1; k++) {
          if (allItems[k] === this.lastSegment) {
            var event = document.createEvent('HTMLEvents');
            event.initEvent('click', true, false);
            // flow-disable-next-line
            allItems[k + 1].querySelector('*[data-t]').dispatchEvent(event);
            break;
          }
        }
      }
    }
  }, {
    key: 'onTimeUpdate',
    value: function onTimeUpdate(event) {
      var time = event.target.currentTime;
      var src = event.target.getAttribute('data-src');
      this.setHead(time, src);
    }
  }, {
    key: 'findMedia',
    value: function findMedia(src) {
      var media = this.root.querySelector('video[src="' + src + '"], audio[src="' + src + '"]');
      if (!media) {
        var source = this.root.querySelector('source[src="' + src + '"], source[src="' + src + '"]');
        if (source) media = source.parentElement;
      }

      return media;
    }
  }, {
    key: 'hideOtherMediaThan',
    value: function hideOtherMediaThan(src) {
      this.root.querySelectorAll('video:not([src="' + src + '"]), audio:not([src="' + src + '"])').forEach(function (media) {
        // flow-disable-next-line
        media.pause();
        media.style.display = 'none';
      });
    }
  }, {
    key: 'createMedia',
    value: function createMedia(src, type) {
      var wrapper = document.createElement('div');

      switch (type.split('/').splice(0, 1).pop()) {
        case 'audio':
          wrapper.innerHTML = '<audio src="' + src + '" type="' + type + '" controls preload></audio>';
          break;

        default:
          wrapper.innerHTML = '<video src="' + src + '" type="' + type + '" controls preload playsinline></video>';
      }

      var media = wrapper.querySelector('audio, video');
      // flow-disable-next-line
      this.root.querySelector('header').appendChild(media);

      return media;
    }
  }, {
    key: 'getMedia',
    value: function getMedia(src, type) {
      var media = this.findMedia(src) || this.createMedia(src, type);

      if (media) {
        this.hideOtherMediaThan(src);
        // flow-disable-next-line
        media.style.display = '';
      }

      if (media && !media.classList.contains('hyperaudio-enabled')) {
        media.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
        media.setAttribute('data-src', src);
        media.classList.add('hyperaudio-enabled');
      }

      return media;
    }
  }]);

  return Player;
}();

exports.default = Player;