'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable class-methods-use-this */

var Player = function () {
  function Player(rootNodeOrSelector) {
    var collectionSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'article';
    var itemSelector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'section';

    _classCallCheck(this, Player);

    this.collectionSelector = collectionSelector;
    this.itemSelector = itemSelector;
    this.root = typeof rootNodeOrSelector === 'string' ? document.querySelector(rootNodeOrSelector) : rootNodeOrSelector;
  }

  _createClass(Player, [{
    key: 'setup',
    value: function setup() /* item */{
      // console.log('TODO setup player for', item.getAttribute('data-src'));
    }
  }]);

  return Player;
}();

exports.default = Player;