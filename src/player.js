export default class Player {
  constructor(rootNodeOrSelector, collectionSelector = 'article', itemSelector = 'section') {
    this.collectionSelector = collectionSelector;
    this.itemSelector = itemSelector;
    this.root = typeof rootNodeOrSelector === 'string' ? document.querySelector(rootNodeOrSelector) : rootNodeOrSelector;
  }

  setup(item) {
    console.log('TODO setup player for', item.getAttribute('data-src'));
  }
}
