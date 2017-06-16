class Player {
  constructor(nodeOrSelector) {
    this.node = typeof nodeOrSelector === 'string' ? document.querySelector(nodeOrSelector) : nodeOrSelector;
  }
}

class Source extends Player {
  constructor(nodeOrSelector) {
    super(nodeOrSelector);

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

    for (const selected of this.node.querySelectorAll('.selected')) {
      if (selection.containsNode(selected, true)) continue;
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
    const selected = this.node.querySelectorAll('.selected');

    for (const node of selected) {
      if (selection.containsNode(node, true)) {
        node.setAttribute('draggable', true);
        node.addEventListener('dragstart', this.onDragStart.bind(this));
        node.addEventListener('dragend', this.onDragEnd.bind(this));
      } else {
        node.classList.remove('selected');
        node.removeAttribute('draggable');
      }
    }

    const range = selection.getRangeAt(0);
    if (selected.length > 0) {
      range.setStartBefore(selected.item(0));
      range.setEndAfter(selected.item(selected.length - 1));
    } else selection.removeAllRanges();
  }

  onDragStart(event) {
    event.dataTransfer.setData('nodes', this.node.querySelectorAll('.selected'));
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.dropEffect = 'copy';
  }

  onDragEnd() {
    for (const node of this.node.querySelectorAll('.selected')) {
      node.classList.remove('selected');
      node.removeAttribute('draggable');
    }
  }
}


class Sink extends Player {
  constructor(nodeOrSelector) {
    super(nodeOrSelector);

    this.node.querySelector('article').addEventListener('dragover', this.onDragOver.bind(this));
    this.node.querySelector('article').addEventListener('dragenter', this.onDragEnter.bind(this));
    // this.node.querySelector('article').addEventListener('dragleave', this.onDragLeave.bind(this));
    this.node.querySelector('article').addEventListener('dragend', this.onDragEnd.bind(this));
    this.node.querySelector('article').addEventListener('drop', this.onDrop.bind(this));
  }

  onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  onDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();

    for (const node of this.node.querySelectorAll('.over')) {
      node.classList.remove('over');
    }

    let target = event.target;
    if (typeof target.matches !== 'function') return;
    while (!target.matches('section[data-src]')) {
      console.log(target);
      target = target.parentNode;
      if (!target) return;
      if (typeof target.matches !== 'function') return;
    }

    target.classList.add('over');
  }

  // onDragLeave(event) {}

  onDragEnd(event) {
    for (const node of this.node.querySelectorAll('.over')) {
      node.classList.remove('over');
    }
  }

  onDrop(event) {
    event.preventDefault();
    console.log(event.dataTransfer.getData('nodes'));
  }
}
