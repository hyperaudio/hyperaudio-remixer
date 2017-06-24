// @flow
/* eslint-disable no-new */

import Player from './player';
import Source from './source';
import Sink from './sink';
import Hyperaudio from './hyperaudio';

window.Player = Player;
window.Source = Source;
window.Sink = Sink;

window.Hyperaudio = Hyperaudio;
if (!window.hyperaudio) window.hyperaudio = new Hyperaudio();
