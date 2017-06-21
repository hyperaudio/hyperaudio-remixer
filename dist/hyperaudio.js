'use strict';

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _source = require('./source');

var _source2 = _interopRequireDefault(_source);

var _sink = require('./sink');

var _sink2 = _interopRequireDefault(_sink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hyperaudio = function Hyperaudio() {
  var nodeOrSelector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

  _classCallCheck(this, Hyperaudio);

  this.node = typeof nodeOrSelector === 'string' ? document.querySelector(nodeOrSelector) : nodeOrSelector;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = this.node.querySelectorAll('.hyperaudio-source')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var source = _step.value;

      new _source2.default(source);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = this.node.querySelectorAll('.hyperaudio-sink')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var sink = _step2.value;

      new _sink2.default(sink);
    }

    // for (const player of this.node.querySelectorAll('.hyperaudio-player')) {
    //   new Player(player);
    // }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
};
