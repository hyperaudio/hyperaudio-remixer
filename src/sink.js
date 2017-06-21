/* eslint-disable class-methods-use-this */

import Player from './player';

export default class Sink extends Player {
  constructor(rootNodeOrSelector, collectionSelector = 'article', itemSelector = 'section') {
    super(rootNodeOrSelector, collectionSelector, itemSelector);

    const collection = this.root.querySelector(this.collectionSelector);
    collection.addEventListener('dragover', this.onDragOver.bind(this));
    collection.addEventListener('dragenter', this.onDragEnter.bind(this));
    // collection.addEventListener('dragleave', this.onDragLeave.bind(this));
    collection.addEventListener('dragend', this.onDragEnd.bind(this));
    collection.addEventListener('drop', this.onDrop.bind(this));

    collection.querySelectorAll(this.itemSelector).forEach(item => this.setup(item));
  }

  setup(item) {
    super.setup(item);

    item.setAttribute('draggable', true);
    item.setAttribute('tabindex', 0);
    item.addEventListener('dragstart', this.onDragStart.bind(this));
    item.addEventListener('dragend', this.onDragEnd2.bind(this));
  }

  onDragStart(event) {
    event.dataTransfer.setData('html', event.target.outerHTML);
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.effectAllowed = 'copy';
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'copy';
  }

  onDragEnd2(event) {
    event.target.remove();
  }

  onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  onDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();

    this.root.querySelectorAll('.over').forEach(item => item.classList.remove('over'));

    let target = event.target;
    if (typeof target.matches !== 'function') return;
    while (!target.matches(`${this.itemSelector}[draggable]`)) { // FIXME
      target = target.parentNode;
      if (!target) return;
      if (typeof target.matches !== 'function') return;
    }

    target.classList.add('over');
  }

  // onDragLeave(event) {}

  onDragEnd() {
    this.root.querySelectorAll('.over').forEach(item => item.classList.remove('over'));
  }

  onDrop(event) {
    event.preventDefault();
    const html = event.dataTransfer.getData('html');

    let target = event.target;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const item = wrapper.children[0];

    if (target.nodeName === 'ARTICLE') { // FIXME
      target.appendChild(item);
      this.setup(item);
    } else {
      while (!target.matches(`${this.itemSelector}[draggable]`)) { // FIXME
        target = target.parentNode;
      }

      target.parentNode.insertBefore(item, target);
      this.setup(item);
    }

    this.onDragEnd();
  }
}
