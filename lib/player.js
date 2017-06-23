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
    this.root.querySelector(this.itemSelector).parentNode.querySelectorAll(this.itemSelector).forEach(function (item) {
      return _this.setup(item);
    });

    // flow-disable-next-line
    this.root.querySelector(this.itemSelector).parentNode.addEventListener('click', this.onClick.bind(this));
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
      });
    }
  }, {
    key: 'onClick',
    value: function onClick(event) {
      var t = event.target.getAttribute('data-t');
      if (!t) return;

      var item = event.target.parentNode;
      while (item && !item.matches(this.itemSelector)) {
        item = item.parentNode;
      }if (!item) return;

      var src = item.getAttribute('data-src');
      if (!src) return;

      // FIXME
      // flow-disable-next-line
      var media = this.getMedia(src);
      if (!media) return;

      var _t$split = t.split(','),
          _t$split2 = _slicedToArray(_t$split, 1),
          start = _t$split2[0];
      // flow-disable-next-line


      media.currentTime = start;
      // flow-disable-next-line
      if (media.paused) media.play();
    }
  }, {
    key: 'setHead',
    value: function setHead(time, src) {
      this.root.querySelectorAll('.hyperaudio-transcript[data-src="' + src + '"]').forEach(function (item) {
        item.querySelectorAll('.past').forEach(function (active) {
          return active.classList.remove('past');
        });
        item.querySelectorAll('.active').forEach(function (active) {
          return active.classList.remove('active');
        });

        var candidates = item.querySelectorAll('*[data-t]');
        for (var i = 0; i < candidates.length; i++) {
          var tc = candidates[i].getAttribute('data-t');
          if (!tc) continue;

          var _tc$split = tc.split(','),
              _tc$split2 = _slicedToArray(_tc$split, 2),
              t = _tc$split2[0],
              d = _tc$split2[1];

          t = parseFloat(t);
          d = parseFloat(d);

          if (t < time) {
            candidates[i].classList.add('past');
          }

          if (t <= time && time < t + d) {
            candidates[i].classList.add('active');
          }

          if (t > time) break;
        }
      });
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
        if (source) media = source.parentNode;
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
          wrapper.innerHTML = '<video src="' + src + '" type="' + type + '" controls preload></video>';
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

      // flow-disable-next-line
      if (media && !media.classList.contains('hyperaudio-enabled')) {
        media.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
        // flow-disable-next-line
        media.setAttribute('data-src', src);
        // flow-disable-next-line
        media.classList.add('hyperaudio-enabled');
      }

      return media;
    }
  }]);

  return Player;
}();

exports.default = Player;