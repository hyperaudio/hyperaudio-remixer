// @flow
/* eslint-disable no-new */

// import transcriptRenderer from '@hyperaudio/transcript-renderer';
import transcriptRenderer from './renderer';
import Player from './player';
import Source from './source';
import Sink from './sink';
import Hyperaudio from './hyperaudio';

window.Player = Player;
window.Source = Source;
window.Sink = Sink;

window.transcriptRenderer = transcriptRenderer;
window.Hyperaudio = Hyperaudio;
if (!window.hyperaudio) window.hyperaudio = new Hyperaudio();
