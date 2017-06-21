/* eslint-disable no-new */

// import Player from './player';
import Source from './source';
import Sink from './sink';

export default class Hyperaudio {
  constructor(nodeOrSelector = document) {
    this.node = typeof nodeOrSelector === 'string' ? document.querySelector(nodeOrSelector) : nodeOrSelector;

    for (const source of this.node.querySelectorAll('.hyperaudio-source')) {
      new Source(source);
    }

    for (const sink of this.node.querySelectorAll('.hyperaudio-sink')) {
      new Sink(sink);
    }

    // for (const player of this.node.querySelectorAll('.hyperaudio-player')) {
    //   new Player(player);
    // }
  }
}
