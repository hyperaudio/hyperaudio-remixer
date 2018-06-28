/* eslint-disable no-new */

import transcriptRenderer from './renderer';
import Player from './player';
import Source from './source';
import Sink, {templates} from './sink';
import Hyperaudio from './hyperaudio';

window.Player = Player;
window.Source = Source;
window.Sink = Sink;
window.SinkTemplates = templates;

window.transcriptRenderer = transcriptRenderer;
window.Hyperaudio = Hyperaudio;
// if (!window.hyperaudio) window.hyperaudio = new Hyperaudio();
