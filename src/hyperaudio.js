/* eslint-disable no-new */

import Player from './player';
import Source from './source';
import Sink from './sink';

export default class Hyperaudio {
  constructor(rootNodeOrSelector = document) {
    this.root = typeof rootNodeOrSelector === 'string' ? document.querySelector(rootNodeOrSelector) : rootNodeOrSelector;

    this.root.querySelectorAll('.hyperaudio-source').forEach(sourceNode => new Source(sourceNode));
    this.root.querySelectorAll('.hyperaudio-sink').forEach(sinkNode => new Sink(sinkNode));
    this.root.querySelectorAll('.hyperaudio-player:not(.hyperaudio-sink):not(.hyperaudio-source)').forEach(playerNode => new Player(playerNode));
  }
}
