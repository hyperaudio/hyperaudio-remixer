'use strict';

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _source = require('./source');

var _source2 = _interopRequireDefault(_source);

var _sink = require('./sink');

var _sink2 = _interopRequireDefault(_sink);

var _hyperaudio = require('./hyperaudio');

var _hyperaudio2 = _interopRequireDefault(_hyperaudio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.Player = _player2.default;
/* eslint-disable no-new */

// import transcriptRenderer from '@hyperaudio/transcript-renderer';

window.Source = _source2.default;
window.Sink = _sink2.default;

window.transcriptRenderer = _renderer2.default;
window.Hyperaudio = _hyperaudio2.default;
if (!window.hyperaudio) window.hyperaudio = new _hyperaudio2.default();