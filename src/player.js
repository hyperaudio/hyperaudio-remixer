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

    if (this.root.querySelector(this.itemSelector)) {
      // flow-disable-next-line
      Array.from(
        this.root
          .querySelector(this.itemSelector)
          .parentElement.querySelectorAll(this.itemSelector)
      ).reverse().forEach(item => this.setup(item));

      // flow-disable-next-line
      this.root
        .querySelector(this.itemSelector)
        .parentElement.addEventListener('click', this.onClick.bind(this));
    }

    this.root
      .querySelector('.hyperaudio-progress')
      .addEventListener('click', this.onSeek.bind(this));
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
      element.parentElement.removeAttribute('class');
    });

    const tokens = Array.from(item.querySelectorAll('*[data-t]'));
    if (tokens.length > 0) {
      const start = parseFloat(tokens[0].getAttribute('data-t').split(',').reverse().pop(), 10);
      const end = tokens[tokens.length - 1].getAttribute('data-t').split(',').reduce((acc, v) => {
        return parseFloat(acc, 10) + parseFloat(v, 10);
      });
      item.setAttribute('data-start', start);
      item.setAttribute('data-end', end);
      item.setAttribute('data-duration', end - start);
    }

    this.progress(null);
  }

  // empty() {
  //   this.root.querySelector(this.itemSelector).parentElement.innerHTML = '';
  //   this.root.querySelector('header').parentElement.innerHTML = '';
  // }

  onClick(event: Object) {
    const t = event.target.getAttribute('data-t');
    if (!t) return;

    let item = event.target.parentElement;
    while (item && !item.matches(this.itemSelector)) item = item.parentElement;
    if (!item) return;

    const src = item.getAttribute('data-src');
    if (!src) return;

    // FIXME
    // flow-disable-next-line
    const media = this.getMedia(src);
    if (!media) return;

    this.root
      .querySelectorAll('.hyperaudio-current')
      .forEach(active => active.classList.remove('hyperaudio-current'));
    item.classList.add('hyperaudio-current');

    const [start, duration] = t.split(',');
    // event.target.classList.add('hyperaudio-duration');

    // flow-disable-next-line
    media.currentTime = start;

    // flow-disable-next-line
    if (media.paused) media.play();

    // const first = event.target.previousElementSibling === null && event.target.parentElement.previousElementSibling === null;

    if (media.style.opacity === '0') {
      media.style.opacity = '1';
      media.classList.remove('hyperaudio-fade');
      media.style.transition = 'opacity .5s ease-in-out';
    }
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
      // item
      //   .querySelectorAll('.hyperaudio-active')
      //   .forEach(active => active.classList.remove('hyperaudio-active'));

      const candidates = item.querySelectorAll('*[data-t]');

      const first = candidates[0];
      const last = candidates[candidates.length - 1];

      // flow-disable-next-line
      const [t0] = first.getAttribute('data-t').split(',');
      if (time < parseFloat(t0)) continue;

      let trim = 0;
      if (
        item.nextElementSibling &&
        item.nextElementSibling.classList.contains('hyperaudio-effect') &&
        item.nextElementSibling.getAttribute('data-type') === 'trim'
      ) {
        trim = parseFloat(item.nextElementSibling.getAttribute('data-value'));
        if (isNaN(trim)) trim = 0;
      }

      let fade = 0;
      if (
        item.nextElementSibling &&
        item.nextElementSibling.classList.contains('hyperaudio-effect') &&
        item.nextElementSibling.getAttribute('data-type') === 'fade'
      ) {
        fade = parseFloat(item.nextElementSibling.getAttribute('data-value'));
        if (isNaN(fade)) fade = 0;
      }

      // flow-disable-next-line
      const [ti, di] = last.getAttribute('data-t').split(',');
      if (time > parseFloat(ti) + parseFloat(di) + trim) continue;

      if (time > parseFloat(ti) + parseFloat(di) - fade) {
        const media = this.getMedia(src);
        if (media && !media.classList.contains('hyperaudio-fade')) {
          media.classList.add('hyperaudio-fade');
          media.style.transition = `opacity ${parseFloat(ti) + parseFloat(di) - time}s ease-in-out`;
          media.style.opacity = '0';
        }
      }

      found = true;
      this.lastSegment = item;

      for (let i = 0; i < candidates.length; i++) {
        const tc = candidates[i].getAttribute('data-t');
        // flow-disable-next-line
        let [t, d] = tc.split(',');
        t = parseFloat(t);
        d = parseFloat(d) + (i === candidates.length - 1 ? trim : 0);

        if (t < time) {
          candidates[i].classList.add('hyperaudio-past');
        }

        if (t <= time && time < t + d) {
          // console.log(time - (t + d) * 1e3);
          candidates[i].classList.add('hyperaudio-past');

          // candidates[i].classList.add('hyperaudio-active');
          // if (!candidates[i].classList.contains('hyperaudio-duration'))
          //   setTimeout(() => {
          //     candidates[i].classList.remove('hyperaudio-duration');
          //     candidates[i].classList.remove('hyperaudio-active');
          //   }, (d - (time - t)) * 1e3);
          // candidates[i].classList.add('hyperaudio-duration');
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
    this.progress(time);
  }

  onSeek(event: Object) {
    let element = event.target;
    if (element.classList.contains('hyperaudio-progress-bar')) element = element.parentElement;
    const { x, width } = element.getClientRects()[0];
    console.log(x, width, event.clientX, element);
    const progress = (event.clientX - x) / width;

    const sections = Array.from(this.root.querySelectorAll('section[data-duration]'));
    const duration = sections.reduce((acc, section) => acc + parseFloat(section.getAttribute('data-duration'), 10), 0);
    const time = progress * duration;

    let localTime = 0;
    const targetSection = sections.find((section, index) => {
      const timeOffset = sections.slice(0, index).reduce((acc, section) => acc + parseFloat(section.getAttribute('data-duration'), 10), 0);
      localTime = time - timeOffset + parseFloat(section.getAttribute('data-start'), 10);
      console.log(time, timeOffset, localTime, section);
      return localTime >= parseFloat(section.getAttribute('data-start'), 10) && localTime < parseFloat(section.getAttribute('data-end'), 10);
    });

    console.log(time, targetSection);
    if (!targetSection) return;

    const click = document.createEvent('HTMLEvents');
    click.initEvent('click', true, false);
    // targetSection.querySelector('*[data-t]').dispatchEvent(click);

    const targetToken = Array.from(targetSection.querySelectorAll('*[data-t]')).find(token => parseFloat(token.getAttribute('data-t'), 10) >= localTime);
    console.log(time, localTime, targetToken);
    targetToken.dispatchEvent(click);
  }

  progress(time) {
    // hyperaudio-progress-bar
    const sections = Array.from(this.root.querySelectorAll('section[data-duration]'));
    const duration = sections.reduce((acc, section) => acc + parseFloat(section.getAttribute('data-duration'), 10), 0);
    const media = Array.from(this.root.querySelectorAll('video, audio')).find(el => el.style.display !== 'none');
    if (time === null) {
      time = 0;
      if (media) time = media.currentTime;
    }

    let currentIndex = sections.findIndex(section => section.classList.contains('hyperaudio-current'));
    if (currentIndex === -1 && media) currentIndex = sections.findIndex(section => section.getAttribute('data-src') === media.getAttribute('data-src'));
    // console.log(duration, currentIndex);
    const bar = this.root.querySelector('.hyperaudio-progress-bar');
    if (currentIndex > -1) {
      const currentSection = sections[currentIndex];
      let progress = time - parseFloat(currentSection.getAttribute('data-start'), 10) + sections.slice(0, currentIndex).reduce((acc, section) => acc + parseFloat(section.getAttribute('data-duration'), 10), 0);
      // console.log(duration, progress);
      progress = progress * 100 / duration;
      if (progress > 100) progress = 100;
      if (bar) bar.style.width = `${progress}%`;
    } else {
      if (bar) bar.style.width = '0%';
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
      if (source) media = source.parentElement;
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
        media.style.opacity = '1';
        media.classList.remove('hyperaudio-fade');
      });
    // mute all other media
    document
      .querySelectorAll(`video:not([src="${src}"]), audio:not([src="${src}"])`)
      .forEach(media => {
        // flow-disable-next-line
        media.pause();
      });
  }

  createMedia(src: string, type: string) {
    const wrapper = document.createElement('div');

    let poster = null;
    const section = this.root.querySelector(`.hyperaudio-transcript[data-src="${src}"]`);
    if (section && section.getAttribute('data-poster')) poster = section.getAttribute('data-poster');

    switch (type.split('/').splice(0, 1).pop()) {
      case 'audio':
        wrapper.innerHTML = `<audio src="${src}" type="${type}" preload></audio>`;
        break;

      default:
        wrapper.innerHTML = `<video src="${src}" type="${type}" preload playsinline></video>`;
    }

    const media = wrapper.querySelector('audio, video');
    if (poster) media.setAttribute('poster', poster);
    // flow-disable-next-line
    // this.root.querySelector('header').appendChild(media);
    const header = this.root.querySelector('header');
    header.insertBefore(media, header.firstChild);

    return media;
  }

  getMedia(src: string, type: string) {
    const media = this.findMedia(src) || this.createMedia(src, type);

    if (media) {
      this.hideOtherMediaThan(src);
      // flow-disable-next-line
      media.style.display = '';
      // flow-disable-next-line
      // media.style.opacity = '1';
    }

    if (media && !media.classList.contains('hyperaudio-enabled')) {
      media.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
      media.addEventListener('click', () => {
        if (media.paused) {
          media.play();
          document
            .querySelectorAll(`video:not([src="${src}"]), audio:not([src="${src}"])`)
            .forEach(media2 => {
              // flow-disable-next-line
              media2.pause();
            });
        } else {
          media.pause();
        }
      });
      media.setAttribute('data-src', src);

      // media.addEventListener('loadedmetadata', (event) => {
      //   const item = this.root.querySelector(`.hyperaudio-transcript[data-src="${src}"]`);
      //   const first = item.querySelector('span[data-t]');
      //   const start = parseFloat(first.getAttribute('data-t').split(',')[0]);
      //   media.currentTime = start;
      // });

      media.classList.add('hyperaudio-enabled');
    }

    return media;
  }
}
