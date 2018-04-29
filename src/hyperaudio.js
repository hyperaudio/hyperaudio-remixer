// @flow
/* eslint-disable no-new */

import Player from './player';
import Source from './source';
import Sink from './sink';

export {Player, Source, Sink};

export default class Hyperaudio {
  root: Element | string; // FIXME
  itemSelector: string;
  collectionSelector: string;

  constructor(rootNodeOrSelector: Element | string = 'html') {
    this.root = typeof rootNodeOrSelector === 'string'
      ? document.querySelector(rootNodeOrSelector) || rootNodeOrSelector
      : rootNodeOrSelector;

    // xflow-disable-next-line
    this.root
      .querySelectorAll('.hyperaudio-source')
      .forEach(sourceNode => new Source(sourceNode));

    // flow-disable-next-line
    this.root
      .querySelectorAll('.hyperaudio-sink')
      .forEach(sinkNode => new Sink(sinkNode));

    // flow-disable-next-line
    this.root
      .querySelectorAll(
        '.hyperaudio-player:not(.hyperaudio-sink):not(.hyperaudio-source)',
      )
      .forEach(playerNode => new Player(playerNode));
  }
}
