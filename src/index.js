class Player {
  constructor(nodeOrSelector) {
    this.node = typeof nodeOrSelector === 'string' ? document.querySelector(nodeOrSelector) : nodeOrSelector;
  }

  setup(node) {
    console.log('TODO setup player for', node.getAttribute('data-src'));
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
    const selected = this.node.querySelectorAll('.selected');

    for (const node of selected) {
      if (selection.containsNode(node, true) || selection.containsNode(node.parentNode, true)) {
        node.setAttribute('draggable', true);
        node.addEventListener('dragstart', this.onDragStart.bind(this));
        // node.addEventListener('dragend', this.onDragEnd.bind(this));
      } else {
        console.log('kill', node);
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

    const node = document.createElement('section');
    for (const selected of this.node.querySelectorAll('.selected')) {
      const clone = selected.cloneNode(true);
      clone.classList.remove('selected');
      clone.removeAttribute('draggable');
      node.appendChild(clone);
    }

    event.dataTransfer.setData('html', node.outerHTML);
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
  constructor(nodeOrSelector) {
    super(nodeOrSelector);

    const article = this.node.querySelector('article');
    article.addEventListener('dragover', this.onDragOver.bind(this));
    article.addEventListener('dragenter', this.onDragEnter.bind(this));
    // article.addEventListener('dragleave', this.onDragLeave.bind(this));
    article.addEventListener('dragend', this.onDragEnd.bind(this));
    article.addEventListener('drop', this.onDrop.bind(this));

    for (const node of article.querySelectorAll('section')) {
      this.setup(node);
    }
  }

  setup(node) {
    super.setup(node);

    node.setAttribute('draggable', true);
    node.setAttribute('tabindex', 0);
    node.addEventListener('dragstart', this.onDragStart.bind(this));
    node.addEventListener('dragend', this.onDragEnd2.bind(this));
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

    for (const node of this.node.querySelectorAll('.over')) {
      node.classList.remove('over');
    }

    let target = event.target;
    if (typeof target.matches !== 'function') return;
    while (!target.matches('section[draggable]')) {
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
    const html = event.dataTransfer.getData('html');

    let target = event.target;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const node = wrapper.children[0];

    if (target.nodeName === 'ARTICLE') {
      target.appendChild(node);
      this.setup(node);
    } else {
      while (!target.matches('section[draggable]')) {
        target = target.parentNode;
      }

      target.parentNode.insertBefore(node, target);
      this.setup(node);
    }

    this.onDragEnd();
  }
}


class Hyperaudio {
  constructor(nodeOrSelector = document) {
    this.node = typeof nodeOrSelector === 'string' ? document.querySelector(nodeOrSelector) : nodeOrSelector;

    // for (const source of this.node.querySelectorAll('.hyperaudio-source')) {
    //   new Source(source);
    // }
    //
    // for (const sink of this.node.querySelectorAll('.hyperaudio-sink')) {
    //   new Sink(sink);
    // }
    //
    // for (const player of this.node.querySelectorAll('.hyperaudio-player')) {
    //   new Player(player);
    // }
  }
}
