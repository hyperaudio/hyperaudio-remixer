// @flow
/* eslint-disable class-methods-use-this */

import Player from './player';

export default class Sink extends Player {
  constructor(
    rootNodeOrSelector: Element | string,
    itemSelector: string = '.hyperaudio-transcript, .hyperaudio-effect',
  ) {
    super(rootNodeOrSelector, itemSelector);

    // flow-disable-next-line
    const collection = this.root.querySelector(this.itemSelector).parentNode;
    if (collection) {
      collection.addEventListener('dragover', this.onDragOver.bind(this));
      collection.addEventListener('dragenter', this.onDragEnter.bind(this));
      collection.addEventListener('dragend', this.onDragEnd.bind(this));
      collection.addEventListener('drop', this.onDrop.bind(this));
      // collection.addEventListener('dragleave', this.onDragLeave.bind(this));
    }
  }

  setup(item: Object) {
    super.setup(item);

    item.setAttribute('draggable', 'true');
    item.setAttribute('tabindex', 0);
    item.addEventListener('dragstart', this.onDragStart.bind(this));
    item.addEventListener('dragend', this.onDragEnd2.bind(this));
  }

  onDragStart(event: Object) {
    event.dataTransfer.setData('html', event.target.outerHTML);
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.effectAllowed = 'copy';
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'copy';
  }

  onDragEnd2(event: Object) {
    event.target.remove();
  }

  onDragOver(event: Object) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  onDragEnter(event: Object) {
    event.preventDefault();
    event.stopPropagation();

    this.root
      .querySelectorAll('.over')
      .forEach(item => item.classList.remove('over'));

    let target = event.target;
    if (typeof target.matches !== 'function') return;
    while (
      target &&
      typeof target.matches === 'function' &&
      !target.matches(`${this.itemSelector}[draggable]`)
    ) {
      // FIXME
      target = target.parentNode;
      if (!target) return;
      if (typeof target.matches !== 'function') return;
    }

    target.classList.add('over');
  }

  // onDragLeave(event) {}

  onDragEnd() {
    this.root
      .querySelectorAll('.over')
      .forEach(item => item.classList.remove('over'));
  }

  onDrop(event: Object) {
    event.preventDefault();
    const html = event.dataTransfer.getData('html');

    let target = event.target;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const item = wrapper.children[0];

    // FIXME
    if (target.nodeName === 'ARTICLE') {
      target.appendChild(item);
      this.setup(item);
    } else {
      // FIXME
      while (
        target &&
        typeof target.matches === 'function' &&
        !target.matches(`${this.itemSelector}[draggable]`)
      ) {
        target = target.parentNode;
      }

      target.parentNode.insertBefore(item, target);
      this.setup(item);
    }

    this.onDragEnd();
  }
}
