'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sink = exports.Source = exports.Player = undefined;

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _source = require('./source');

var _source2 = _interopRequireDefault(_source);

var _sink = require('./sink');

var _sink2 = _interopRequireDefault(_sink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/* eslint-disable no-new */

exports.Player = _player2.default;
exports.Source = _source2.default;
exports.Sink = _sink2.default;

var Hyperaudio = // FIXME
function Hyperaudio() {
  var rootNodeOrSelector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'html';

  _classCallCheck(this, Hyperaudio);

  this.root = typeof rootNodeOrSelector === 'string' ? document.querySelector(rootNodeOrSelector) || rootNodeOrSelector : rootNodeOrSelector;

  // xflow-disable-next-line
  this.root.querySelectorAll('.hyperaudio-source').forEach(function (sourceNode) {
    return new _source2.default(sourceNode);
  });

  // flow-disable-next-line
  this.root.querySelectorAll('.hyperaudio-sink').forEach(function (sinkNode) {
    return new _sink2.default(sinkNode);
  });

  // flow-disable-next-line
  this.root.querySelectorAll('.hyperaudio-player:not(.hyperaudio-sink):not(.hyperaudio-source)').forEach(function (playerNode) {
    return new _player2.default(playerNode);
  });
};

exports.default = Hyperaudio;