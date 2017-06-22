// @flow
/* eslint-disable class-methods-use-this, no-unused-vars, no-plusplus, no-continue */

export default class Player {
  root: Element;
  itemSelector: string;

  constructor(
    rootNodeOrSelector: Element | string,
    itemSelector: string = '.hyperaudio-transcript, .hyperaudio-effect',
  ) {
    this.itemSelector = itemSelector;
    this.root = typeof rootNodeOrSelector === 'string'
      ? document.querySelector(rootNodeOrSelector) ||
          document.createElement('section')
      : rootNodeOrSelector;

    // flow-disable-next-line
    this.root
      .querySelector(this.itemSelector)
      .parentNode.querySelectorAll(this.itemSelector)
      .forEach(item => this.setup(item));

    // flow-disable-next-line
    this.root
      .querySelector(this.itemSelector)
      .parentNode.addEventListener('click', this.onClick.bind(this));
  }

  setup(item: Object) {
    const src = item.getAttribute('data-src');
    const type = item.getAttribute('data-type');

    if (src) this.getMedia(src, type);

    // data-m?
    item.querySelectorAll('*[data-m]').forEach(element => {
      const m = element.getAttribute('data-m');
      const d = element.getAttribute('data-d');
      const t = [];

      if (m) t.push(parseInt(m, 10) / 1000);
      if (d) t.push(parseInt(d, 10) / 1000);

      element.setAttribute('data-t', t.join(','));
      element.removeAttribute('data-m');
      element.removeAttribute('data-d');
    });
  }

  onClick(event: Object) {
    const t = event.target.getAttribute('data-t');
    if (!t) return;

    let item = event.target.parentNode;
    while (item && !item.matches(this.itemSelector)) item = item.parentNode;
    if (!item) return;

    const src = item.getAttribute('data-src');
    if (!src) return;

    const media = this.findMedia(src);
    if (!media) return;

    const [start] = t.split(',');
    // flow-disable-next-line
    media.currentTime = start;
  }

  setHead(time: number, src: string) {
    this.root
      .querySelectorAll(`.hyperaudio-transcript[data-src="${src}"]`)
      .forEach(item => {
        item
          .querySelectorAll('.past')
          .forEach(active => active.classList.remove('past'));
        item
          .querySelectorAll('.active')
          .forEach(active => active.classList.remove('active'));

        const candidates = item.querySelectorAll('*[data-t]');
        for (let i = 0; i < candidates.length; i++) {
          const tc = candidates[i].getAttribute('data-t');
          if (!tc) continue;
          let [t, d] = tc.split(',');
          t = parseFloat(t);
          d = parseFloat(d);

          if (t < time) {
            candidates[i].classList.add('past');
          }

          if (t <= time && time < t + d) {
            candidates[i].classList.add('active');
          }

          if (t > time) break;
        }
      });
  }

  onTimeUpdate(event: Object) {
    const time = event.target.currentTime;
    const src = event.target.getAttribute('data-src');
    this.setHead(time, src);
  }

  findMedia(src: string) {
    let media = this.root.querySelector(
      `video[src="${src}"], audio[src="${src}"]`,
    );
    if (!media) {
      const source = this.root.querySelector(
        `source[src="${src}"], source[src="${src}"]`,
      );
      if (source) media = source.parentNode;
    }
    return media;
  }

  createMedia(src: string, type: string) {
    const wrapper = document.createElement('div');

    switch (type.split('/').splice(0, 1).pop()) {
      case 'audio':
        wrapper.innerHTML = `<audio src="${src}" type="${type}" controls preload></audio>`;
        break;

      default:
        wrapper.innerHTML = `<video src="${src}" type="${type}" controls preload></video>`;
    }

    const media = wrapper.querySelector('audio, video');
    // flow-disable-next-line
    this.root.querySelector('header').appendChild(media);

    return media;
  }

  getMedia(src: string, type: string) {
    const media = this.findMedia(src) || this.createMedia(src, type);

    // flow-disable-next-line
    if (media && !media.classList.contains('hyperaudio-enabled')) {
      media.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
      // flow-disable-next-line
      media.setAttribute('data-src', src);
      // flow-disable-next-line
      media.classList.add('hyperaudio-enabled');
    }

    return media;
  }
}
