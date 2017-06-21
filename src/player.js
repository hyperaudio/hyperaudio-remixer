// @flow
/* eslint-disable class-methods-use-this, no-unused-vars */

export default class Player {
  root: Object | string; // FIXME
  itemSelector: string;

  constructor(
    rootNodeOrSelector: Object | string,
    itemSelector: string = '.hyperaudio-transcript, .hyperaudio-effect',
  ) {
    this.itemSelector = itemSelector;
    this.root = typeof rootNodeOrSelector === 'string'
      ? document.querySelector(rootNodeOrSelector) || rootNodeOrSelector
      : rootNodeOrSelector;
  }

  setup(item: Object) {
    // console.log('TODO setup player for', item.getAttribute('data-src'));
  }
}
