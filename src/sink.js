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
    event.dataTransfer.setData('text/html', event.target.outerHTML);
    event.dataTransfer.setData('text/plain', event.target.innerText);
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
      .querySelectorAll('.hyperaudio-over:not(article)')
      .forEach(item => item.classList.remove('hyperaudio-over'));

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

    target.classList.add('hyperaudio-over');
    // flow-disable-next-line
    this.root.querySelector('article').classList.add('hyperaudio-over');
  }

  // onDragLeave(event) {}

  onDragEnd() {
    this.root
      .querySelectorAll('.hyperaudio-over')
      .forEach(item => item.classList.remove('hyperaudio-over'));
  }

  onDrop(event: Object) {
    event.preventDefault();
    const html = event.dataTransfer.getData('text/html');

    let target = event.target;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;

    // flow-disable-next-line
    if (wrapper.querySelector('meta')) wrapper.querySelector('meta').remove();

    const item = wrapper.children[0];

    // FIXME
    if (target.nodeName === 'DIV') target = target.parentNode;
    if (target.nodeName === 'ARTICLE') {
      // target.appendChild(item);
      target.insertBefore(item, target.querySelector('div'));
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