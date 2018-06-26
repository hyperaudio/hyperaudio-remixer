// @flow
/* eslint-disable class-methods-use-this, no-param-reassign */

import Player from './player';

export default class Source extends Player {
  constructor(
    rootNodeOrSelector: Element | string,
    itemSelector: string = '.hyperaudio-transcript, .hyperaudio-effect',
  ) {
    super(rootNodeOrSelector, itemSelector);

    document.addEventListener(
      'selectionchange',
      this.onSelectionChange.bind(this),
    );

    // flow-disable-next-line
    const collection = this.root.querySelector(this.itemSelector).parentElement;
    if (collection && !collection.classList.contains('hyperaudio-enabled')) {
      collection.addEventListener('mouseup', this.onMouseUp.bind(this));
      collection.classList.add('hyperaudio-enabled');
    }
  }

  onSelectionChange() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.startOffset === range.endOffset) return;

    const commonAncestor = range.commonAncestorContainer;

    // document.TEXT_NODE
    if (commonAncestor.nodeType === 3) {
      range.setStartBefore(commonAncestor.parentElement);
      return;
    }

    if (
      !(
        commonAncestor.matches('section[data-src]') ||
        commonAncestor.parentElement.matches('section[data-src]')
      )
    )
      return;

    commonAncestor.querySelectorAll('*').forEach(candidate => {
      // FIXME
      if (
        selection.containsNode(candidate, true) &&
        candidate.nodeName !== 'P'
      ) {
        candidate.classList.add('hyperaudio-selected');
      } else {
        candidate.classList.remove('hyperaudio-selected');
      }
    });

    this.root.querySelectorAll('.hyperaudio-selected').forEach(selected => {
      if (
        selection.containsNode(selected, true) ||
        selection.containsNode(selected.parentElement, true)
      )
        return;
      selected.classList.remove('hyperaudio-selected');
      selected.removeAttribute('draggable');
    });
  }

  onMouseUp() {
    const selection = window.getSelection();
    const selected = this.root.querySelectorAll('.hyperaudio-selected');

    selected.forEach(node => {
      if (
        selection.containsNode(node, true) // ||
        // selection.containsNode(node.parentElement, true)
      ) {
        node.setAttribute('draggable', 'true');
        node.addEventListener('dragstart', this.onDragStart.bind(this));
        node.addEventListener('dragend', this.onDragEnd.bind(this));
      } else {
        // console.log('kill', node);
        node.classList.remove('hyperaudio-selected');
        node.removeAttribute('draggable');
      }
    });

    selection.removeAllRanges();

    // if (selected.length > 0 && selection.rangeCount > 0) {
    //   const range = selection.getRangeAt(0);
    //   range.setStartBefore(selected.item(0));
    //   range.setEndAfter(selected.item(selected.length - 1));
    // } else {
    //   selection.removeAllRanges();
    // }
  }

  onDragStart(event: Object) {
    // event.preventDefault();
    // event.stopPropagation();

    let item;
    let parent;
    let prevSelected;
    this.root.querySelectorAll('.hyperaudio-selected').forEach(selected => {
      const clone = selected.cloneNode(true);
      clone.classList.remove('hyperaudio-selected');
      clone.classList.remove('hyperaudio-active');
      clone.classList.remove('hyperaudio-past');
      // clone.removeAttribute('class');
      clone.removeAttribute('draggable');

      // flow-disable-next-line
      if (!item) item = selected.parentElement.parentElement.cloneNode(false);
      if (!parent) {
        // flow-disable-next-line
        parent = selected.parentElement.cloneNode(false);
        // parent.removeAttribute('class');
        item.appendChild(parent);
      }

      if (
        prevSelected &&
        prevSelected.parentElement !== selected.parentElement
      ) {
        // flow-disable-next-line
        parent = selected.parentElement.cloneNode(false);
        item.appendChild(parent);
      }
      parent.appendChild(clone);
      prevSelected = selected;
    });

    // flow-disable-next-line
    event.dataTransfer.setData('text/html', item.outerHTML);
    // flow-disable-next-line
    event.dataTransfer.setData('text/plain', item.innerText);
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.dropEffect = 'copy';

    // flow-disable-next-line
    const itemClone = item.cloneNode(true);

    // itemClone.style.position = 'absolute';
    // itemClone.style.top = '0px';
    // itemClone.style.left = '-100px';
    // document.body.appendChild(itemClone);

    var dragItems = this.root.querySelector('.hyperaudio-drag');
    var width = this.root.querySelector('article').getBoundingClientRect().width;
    dragItems.style.width = `${width}px`;
    dragItems.appendChild(itemClone);
    event.dataTransfer.setDragImage(itemClone, 0, 0);
  }

  onDragEnd() {
    this.root.querySelectorAll('.hyperaudio-selected').forEach(node => {
      node.classList.remove('hyperaudio-selected');
      node.removeAttribute('draggable');
    });
  }
}
