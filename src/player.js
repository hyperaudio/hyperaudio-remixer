// @flow
/* eslint-disable class-methods-use-this, no-unused-vars */

export default class Player {
  root: Object | string; // FIXME
  itemSelector: string;
  collectionSelector: string;

  constructor(rootNodeOrSelector: Object | string, collectionSelector: string = 'article', itemSelector: string = 'section') {
    this.collectionSelector = collectionSelector;
    this.itemSelector = itemSelector;
    this.root = typeof rootNodeOrSelector === 'string' ? document.querySelector(rootNodeOrSelector) || rootNodeOrSelector : rootNodeOrSelector;
  }

  setup(item: Object) {
    // console.log('TODO setup player for', item.getAttribute('data-src'));
  }
}
