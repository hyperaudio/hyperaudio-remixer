// @flow
/* eslint-disable no-new */

import Player from './player';
import Source from './source';
import Sink from './sink';

export default class Hyperaudio {
  root: Object | string; // FIXME
  itemSelector: string;
  collectionSelector: string;

  constructor(rootNodeOrSelector: Object | string = document) {
    this.root = typeof rootNodeOrSelector === 'string' ? document.querySelector(rootNodeOrSelector) || rootNodeOrSelector : rootNodeOrSelector;

    // flow-disable-next-line
    this.root.querySelectorAll('.hyperaudio-source').forEach(sourceNode => new Source(sourceNode));
    // flow-disable-next-line
    this.root.querySelectorAll('.hyperaudio-sink').forEach(sinkNode => new Sink(sinkNode));
    // flow-disable-next-line
    this.root.querySelectorAll('.hyperaudio-player:not(.hyperaudio-sink):not(.hyperaudio-source)').forEach(playerNode => new Player(playerNode));
  }
}
