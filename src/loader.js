// @flow
/* eslint-disable no-new */

import Hyperaudio from './hyperaudio';

window.Hyperaudio = Hyperaudio;
if (!window.hyperaudio) window.hyperaudio = new Hyperaudio();
