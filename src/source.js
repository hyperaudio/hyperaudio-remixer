// @flow
/* eslint-disable class-methods-use-this */

import Player from './player';

export default class Source extends Player {
  constructor(
    rootNodeOrSelector: Object | string,
    itemSelector: string = '.hyperaudio-transcript, .hyperaudio-effect',
  ) {
    super(rootNodeOrSelector, itemSelector);

    document.addEventListener(
      'selectionchange',
      this.onSelectionChange.bind(this),
    );
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onSelectionChange() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;

    // document.TEXT_NODE
    if (commonAncestor.nodeType === 3) {
      range.setStartBefore(commonAncestor.parentNode);
      return;
    }

    if (
      !(
        commonAncestor.matches('section[data-src]') ||
        commonAncestor.parentNode.matches('section[data-src]')
      )
    )
      return;

    // flow-disable-next-line
    this.root.querySelectorAll('.selected').forEach(selected => {
      if (
        selection.containsNode(selected, true) ||
        selection.containsNode(selected.parentNode, true)
      )
        return;
      selected.classList.remove('selected');
      selected.removeAttribute('draggable');
    });

    commonAncestor.querySelectorAll('*').forEach(candidate => {
      // FIXME
      if (
        selection.containsNode(candidate, true) &&
        candidate.nodeName !== 'P'
      ) {
        candidate.classList.add('selected');
      }
    });
  }

  onMouseUp() {
    const selection = window.getSelection();
    // flow-disable-next-line
    const selected = this.root.querySelectorAll('.selected');

    selected.forEach(node => {
      if (
        selection.containsNode(node, true) ||
        selection.containsNode(node.parentNode, true)
      ) {
        node.setAttribute('draggable', true);
        node.addEventListener('dragstart', this.onDragStart.bind(this));
        // node.addEventListener('dragend', this.onDragEnd.bind(this));
      } else {
        // console.log('kill', node);
        node.classList.remove('selected');
        node.removeAttribute('draggable');
      }
    });

    if (selected.length > 0 && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.setStartBefore(selected.item(0));
      range.setEndAfter(selected.item(selected.length - 1));
    } else {
      selection.removeAllRanges();
    }
  }

  onDragStart(/* event) */) {
    // event.preventDefault();
    // event.stopPropagation();

    const item = document.createElement('section');
    let parent = document.createElement('p');
    item.appendChild(parent);
    let prevSelected = null;
    // flow-disable-next-line
    this.root.querySelectorAll('.selected').forEach(selected => {
      const clone = selected.cloneNode(true);
      clone.classList.remove('selected');
      clone.removeAttribute('draggable');
      if (prevSelected && prevSelected.parentNode !== selected.parentNode) {
        parent = document.createElement('p');
        item.appendChild(parent);
      }
      parent.appendChild(clone);
      prevSelected = selected;
    });

    // flow-disable-next-line
    event.dataTransfer.setData('html', item.outerHTML);
    // eslint-disable-next-line no-param-reassign flow-disable-next-line
    event.dataTransfer.effectAllowed = 'copy';
    // eslint-disable-next-line no-param-reassign flow-disable-next-line
    event.dataTransfer.dropEffect = 'copy';

    // return false;
  }

  // onDragEnd() {
  //   for (const node of this.node.querySelectorAll('.selected')) {
  //     node.classList.remove('selected');
  //     node.removeAttribute('draggable');
  //   }
  // }
}
