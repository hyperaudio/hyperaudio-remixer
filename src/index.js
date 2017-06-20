class Player {
  constructor(rootNodeOrSelector, collectionSelector = 'article', itemSelector = 'section') {
    this.collectionSelector = collectionSelector;
    this.itemSelector = itemSelector;
    this.root = typeof rootNodeOrSelector === 'string' ? document.querySelector(rootNodeOrSelector) : rootNodeOrSelector;
  }

  setup(item) {
    console.log('TODO setup player for', item.getAttribute('data-src'));
  }
}


class Source extends Player {
  constructor(rootNodeOrSelector, collectionSelector = 'article', itemSelector = 'section') {
    super(rootNodeOrSelector);

    document.addEventListener('selectionchange', this.onSelectionChange.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onSelectionChange() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;

    if (commonAncestor.nodeType === document.TEXT_NODE) {
      range.setStartBefore(commonAncestor.parentNode);
      return;
    }

    if (!(commonAncestor.matches('section[data-src]') || commonAncestor.parentNode.matches('section[data-src]'))) return;

    for (const selected of this.root.querySelectorAll('.selected')) {
      if (selection.containsNode(selected, true) || selection.containsNode(selected.parentNode, true)) continue;
      selected.classList.remove('selected');
      selected.removeAttribute('draggable');
    }

    for (const candidate of commonAncestor.getElementsByTagName('*')) {
      if (selection.containsNode(candidate, true) && candidate.nodeName !== 'P') {
        candidate.classList.add('selected');
      }
    }
  }

  onMouseUp() {
    const selection = window.getSelection();
    const selected = this.root.querySelectorAll('.selected');

    for (const node of selected) {
      if (selection.containsNode(node, true) || selection.containsNode(node.parentNode, true)) {
        node.setAttribute('draggable', true);
        node.addEventListener('dragstart', this.onDragStart.bind(this));
        // node.addEventListener('dragend', this.onDragEnd.bind(this));
      } else {
        // console.log('kill', node);
        node.classList.remove('selected');
        node.removeAttribute('draggable');
      }
    }

    if (selected.length > 0 && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.setStartBefore(selected.item(0));
      range.setEndAfter(selected.item(selected.length - 1));
    } else {
      selection.removeAllRanges();
    }
  }

  onDragStart(event) {
    // event.preventDefault();
    // event.stopPropagation();

    const item = document.createElement('section');
    for (const selected of this.root.querySelectorAll('.selected')) {
      const clone = selected.cloneNode(true);
      clone.classList.remove('selected');
      clone.removeAttribute('draggable');
      item.appendChild(clone);
    }

    event.dataTransfer.setData('html', item.outerHTML);
    event.dataTransfer.effectAllowed = 'copy';
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


class Sink extends Player {
  constructor(rootNodeOrSelector, collectionSelector = 'article', itemSelector = 'section') {
    super(rootNodeOrSelector, collectionSelector, itemSelector);

    const collection = this.root.querySelector(this.collectionSelector);
    collection.addEventListener('dragover', this.onDragOver.bind(this));
    collection.addEventListener('dragenter', this.onDragEnter.bind(this));
    // collection.addEventListener('dragleave', this.onDragLeave.bind(this));
    collection.addEventListener('dragend', this.onDragEnd.bind(this));
    collection.addEventListener('drop', this.onDrop.bind(this));

    for (const item of collection.querySelectorAll(this.itemSelector)) {
      this.setup(item);
    }
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
    event.dataTransfer.effectAllowed = 'copy';
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

    for (const item of this.root.querySelectorAll('.over')) {
      item.classList.remove('over');
    }

    let target = event.target;
    if (typeof target.matches !== 'function') return;
    while (!target.matches(this.itemSelector + '[draggable]')) { // FIXME
      target = target.parentNode;
      if (!target) return;
      if (typeof target.matches !== 'function') return;
    }

    target.classList.add('over');
  }

  // onDragLeave(event) {}

  onDragEnd(event) {
    for (const item of this.root.querySelectorAll('.over')) {
      item.classList.remove('over');
    }
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
      while (!target.matches(this.itemSelector + '[draggable]')) { // FIXME
        target = target.parentNode;
      }

      target.parentNode.insertBefore(item, target);
      this.setup(item);
    }

    this.onDragEnd();
  }
}


class Hyperaudio {
  constructor(nodeOrSelector = document) {
    this.node = typeof nodeOrSelector === 'string' ? document.querySelector(nodeOrSelector) : nodeOrSelector;

    for (const player of this.node.querySelectorAll('.hyperaudio-player')) {
      new Player(player);
    }
  }
}

// for (const source of this.node.querySelectorAll('.hyperaudio-source')) {
//   new Source(source);
// }
//
// for (const sink of this.node.querySelectorAll('.hyperaudio-sink')) {
//   new Sink(sink);
// }
