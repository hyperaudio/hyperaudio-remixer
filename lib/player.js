'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable class-methods-use-this, no-unused-vars */

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
  }

  _createClass(Player, [{
    key: 'setup',
    value: function setup(item) {
      var src = item.getAttribute('data-src');
      var type = item.getAttribute('data-type');

      if (src) console.log(this.getMedia(src, type));
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

      return wrapper.querySelector('audio, video');
    }
  }, {
    key: 'getMedia',
    value: function getMedia(src, type) {
      var media = this.findMedia(src) || this.createMedia(src, type);

      // flow-disable-next-line
      this.root.querySelector('header').appendChild(media);

      return media;
    }
  }]);

  return Player;
}();

exports.default = Player;