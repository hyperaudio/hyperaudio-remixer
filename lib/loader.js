'use strict';

var _hyperaudio = require('./hyperaudio');

var _hyperaudio2 = _interopRequireDefault(_hyperaudio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.Hyperaudio = _hyperaudio2.default;
/* eslint-disable no-new */

if (!window.hyperaudio) window.hyperaudio = new _hyperaudio2.default();