// @flow
/* eslint-disable class-methods-use-this, no-param-reassign */

import Player from './player';

export const templates = {
  trim:  '<section class="hyperaudio-effect" data-type="trim" data-value="1"><label>Trim <span>1</span>s <input type="range" value="1" min="0.5" max="7" step="0.1"></label></section>',
  fade:  '<section class="hyperaudio-effect" data-type="fade" data-value="1"><label>Fade <span>1</span>s <input type="range" value="1" min="0.5" max="7" step="0.1"></label></section>',
};

export default class Sink extends Player {
  target: Element;

  constructor(
    rootNodeOrSelector: Element | string,
    itemSelector: string = '.hyperaudio-transcript, .hyperaudio-effect',
  ) {
    super(rootNodeOrSelector, itemSelector);

    if (this.root.querySelector(this.itemSelector)) {
      // flow-disable-next-line
      const collection = this.root.querySelector(this.itemSelector).parentElement;
      if (collection) {
        collection.addEventListener('dragover', this.onDragOver.bind(this));
        collection.addEventListener('dragenter', this.onDragEnter.bind(this));
        collection.addEventListener('dragend', this.onDragEnd.bind(this));
        collection.addEventListener('drop', this.onDrop.bind(this));
        // collection.addEventListener('dragleave', this.onDragLeave.bind(this));
      }
    }

    this.root.querySelectorAll('.hyperaudio-effect-source').forEach(button => {
      const type = button.getAttribute('data-type') || 'trim';
      const html = templates[type];
      button.setAttribute('draggable', 'true');
      button.addEventListener('dragstart', (event: Object) => {
        event.dataTransfer.setData('text/html', html);
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.dropEffect = 'copy';
      });
    });
  }

  setup(item: Object) {
    super.setup(item);

    item.setAttribute('draggable', 'true');
    item.setAttribute('tabindex', 0);
    item.addEventListener('mousedown', this.onMouseDown.bind(this));
    item.addEventListener('dragstart', this.onDragStart.bind(this));
    item.addEventListener('dragend', this.onDragEnd2.bind(this));

    if (
      item.classList.contains('hyperaudio-effect') &&
      item.querySelector('input')
    ) {
      item.querySelector('input').addEventListener('input', event => {
        const value = event.target.value;
        item.querySelector('span').innerText = value;
        event.target.setAttribute('value', value);
        item.setAttribute('data-value', value);
        this.exposeURL();
      });
    }

    this.exposeURL();
  }

  exposeURL() {
    const data = [];
    this.root.querySelector('article').querySelectorAll(this.itemSelector).forEach(item => {
      if (item.classList.contains('hyperaudio-effect')) {
        data.push({
          mode: 'effect',
          type: item.getAttribute('data-type'),
          value: item.getAttribute('data-value'),
        });
      } else {
        const start = parseFloat(item.querySelector('span[data-t]').getAttribute('data-t').split(',')[0]);
        const end = parseFloat(item.querySelector('span[data-t]:last-child').getAttribute('data-t').split(',').map(v => parseFloat(v)).reduce((acc, v) => v + acc));
        data.push({
          mode: 'transcript',
          id: item.getAttribute('data-id'),
          start, end,
        });
      }
    });

    // console.log(data);

    const fragments = data.reduce((acc, segment) => {
      if (segment.mode === 'effect') {
        if (segment.value) {
          const prevSegment = acc.pop();
          return [...acc, `${prevSegment}:${segment.type === 'fade' ? 'f' : 't'}${segment.value}`];
        }
        return [...acc];
      }

      return [...acc, `${segment.id}:${segment.start},${segment.end}`];
    }, []);
    console.log(fragments);

    window.history.replaceState({}, document.title, `?r=${fragments.join(';')}`);
    window.HyperaudioURL = window.location.href;
  }

  onMouseDown(event: Object) {
    this.target = event.target;
  }

  onDragStart(event: Object) {
    if (
      event.target.classList.contains('hyperaudio-effect') &&
      this.target &&
      this.target.nodeName === 'INPUT'
    ) {
      event.preventDefault();
    } else {
      event.dataTransfer.setData('text/html', event.target.outerHTML);
      event.dataTransfer.setData('text/plain', event.target.innerText);
      // eslint-disable-next-line no-param-reassign
      event.dataTransfer.effectAllowed = 'copy';
      // eslint-disable-next-line no-param-reassign
      event.dataTransfer.dropEffect = 'copy';
    }
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
      target = target.parentElement;
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

    // const controls = document.createElement('div');
    // controls.innerHTML = '<input type="range" />';
    // item.append(controls);

    // FIXME
    if (target.nodeName === 'DIV') target = target.parentElement;
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
        target = target.parentElement;
      }

      target.parentElement.insertBefore(item, target);
      this.setup(item);
    }

    // this.root
    document // FIXME
      .querySelectorAll('.hyperaudio-source > section')
      .forEach(section => section.remove());

    this.onDragEnd();
  }
}
