// @flow
/* eslint-disable class-methods-use-this, no-unused-vars, no-plusplus, no-continue, no-param-reassign */

export default class Player {
  root: Element;
  itemSelector: string;
  currentSrc: string;
  lastSegment: Element;

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
      element.removeAttribute('class');
      element.parentNode.removeAttribute('class');
    });
  }

  // empty() {
  //   this.root.querySelector(this.itemSelector).parentNode.innerHTML = '';
  //   this.root.querySelector('header').parentNode.innerHTML = '';
  // }

  onClick(event: Object) {
    const t = event.target.getAttribute('data-t');
    if (!t) return;

    let item = event.target.parentNode;
    while (item && !item.matches(this.itemSelector)) item = item.parentNode;
    if (!item) return;

    const src = item.getAttribute('data-src');
    if (!src) return;

    // FIXME
    // flow-disable-next-line
    const media = this.getMedia(src);
    if (!media) return;

    const [start, duration] = t.split(',');
    // event.target.classList.add('hyperaudio-duration');

    // flow-disable-next-line
    media.currentTime = start;

    // flow-disable-next-line
    if (media.paused) media.play();
  }

  setHead(time: number, src: string) {
    this.currentSrc = src;
    let found = false;

    const items = this.root.querySelectorAll(
      `.hyperaudio-transcript[data-src="${src}"]`,
    );

    for (let j = 0; j < items.length; j++) {
      const item = items[j];

      item
        .querySelectorAll('.hyperaudio-past')
        .forEach(active => active.classList.remove('hyperaudio-past'));
      item
        .querySelectorAll('.hyperaudio-active')
        .forEach(active => active.classList.remove('hyperaudio-active'));

      const candidates = item.querySelectorAll('*[data-t]');

      const first = candidates[0];
      const last = candidates[candidates.length - 1];

      // flow-disable-next-line
      const [t0] = first.getAttribute('data-t').split(',');
      if (time < parseFloat(t0)) continue;

      // flow-disable-next-line
      const [ti, di] = last.getAttribute('data-t').split(',');
      if (time > parseFloat(ti) + parseFloat(di)) continue;

      found = true;
      this.lastSegment = item;

      for (let i = 0; i < candidates.length; i++) {
        const tc = candidates[i].getAttribute('data-t');
        // flow-disable-next-line
        let [t, d] = tc.split(',');
        t = parseFloat(t);
        d = parseFloat(d);

        if (t < time) {
          candidates[i].classList.add('hyperaudio-past');
        }

        if (t <= time && time < t + d) {
          // console.log(time - (t + d) * 1e3);
          candidates[i].classList.add('hyperaudio-active');
          if (!candidates[i].classList.contains('hyperaudio-duration'))
            setInterval(() => {
              candidates[i].classList.remove('hyperaudio-duration');
            }, (d - (time - t)) * 1e3);
          candidates[i].classList.add('hyperaudio-duration');
        }

        if (t > time) break;
      }
    }

    if (!found) {
      // flow-disable-next-line
      const media = this.getMedia(src);
      // flow-disable-next-line
      media.pause();

      const allItems = this.root.querySelectorAll('.hyperaudio-transcript');
      for (let k = 0; k < allItems.length - 1; k++) {
        if (allItems[k] === this.lastSegment) {
          const event = document.createEvent('HTMLEvents');
          event.initEvent('click', true, false);
          // flow-disable-next-line
          allItems[k + 1].querySelector('*[data-t]').dispatchEvent(event);
          break;
        }
      }
    }
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

  hideOtherMediaThan(src: string) {
    this.root
      .querySelectorAll(`video:not([src="${src}"]), audio:not([src="${src}"])`)
      .forEach(media => {
        // flow-disable-next-line
        media.pause();
        media.style.display = 'none';
      });
  }

  createMedia(src: string, type: string) {
    const wrapper = document.createElement('div');

    switch (type.split('/').splice(0, 1).pop()) {
      case 'audio':
        wrapper.innerHTML = `<audio src="${src}" type="${type}" controls preload></audio>`;
        break;

      default:
        wrapper.innerHTML = `<video src="${src}" type="${type}" controls preload playsinline></video>`;
    }

    const media = wrapper.querySelector('audio, video');
    // flow-disable-next-line
    this.root.querySelector('header').appendChild(media);

    return media;
  }

  getMedia(src: string, type: string) {
    const media = this.findMedia(src) || this.createMedia(src, type);

    if (media) {
      this.hideOtherMediaThan(src);
      // flow-disable-next-line
      media.style.display = '';
    }

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
