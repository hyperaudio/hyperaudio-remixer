/* eslint-disable max-len,class-methods-use-this, no-unused-vars, no-plusplus, no-continue, no-param-reassign */

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

      this.lockTimeUpdate = true;
      this.prevProgress = 0;
      this.scrolling = false;
    }

    this.root
      .querySelector('.hyperaudio-progress')
      .addEventListener('click', this.onSeek.bind(this));

    this.root
      .querySelector('.hyperaudio-play-button')
      .addEventListener('click', this.play.bind(this));
    this.root
      .querySelector('.hyperaudio-pause-button')
      .addEventListener('click', this.pause.bind(this));
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
    this.lockTimeUpdate = true;
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
    this.currentSrc = src;

    this.root
      .querySelectorAll('.hyperaudio-current')
      .forEach(active => active.classList.remove('hyperaudio-current'));
    item.classList.add('hyperaudio-current');
    // if (jQuery && jQuery().scrollTo) jQuery().scrollTo(item, { duration: 1 });

    const [start, duration] = t.split(',');
    // event.target.classList.add('hyperaudio-duration');

    // flow-disable-next-line
    media.currentTime = start;
    this.lockTimeUpdate = false;

    // flow-disable-next-line
    if (media.paused) {
      document
        .querySelectorAll(`video, audio`)
        .forEach(media2 => {
          if (media !== media2) media2.pause();
        });
      media.play();
    }

    // const first = event.target.previousElementSibling === null && event.target.parentElement.previousElementSibling === null;

    if (media.style.opacity === '0') {
      media.style.opacity = '1';
      media.classList.remove('hyperaudio-fade');
      media.style.transition = 'opacity .5s ease-in-out';
    }
  }

  setHead(time: number, src: string) {
    if (this.lockTimeUpdate) return;
    this.currentSrc = src;
    let found = false;
    let tokenFound = false;
    let exactTokenFound = false;

    const items = this.root.querySelectorAll(
      `.hyperaudio-current[data-src="${src}"]`,
    );

    this.root
      .querySelectorAll('.hyperaudio-past')
      .forEach(active => active.classList.remove('hyperaudio-past'));

    for (let j = 0; j < items.length; j++) {
      const item = items[j];

      const candidates = item.querySelectorAll('*[data-t]');

      const first = candidates[0];
      const last = candidates[candidates.length - 1];

      const [t0] = first.getAttribute('data-t').split(',');
      if (time < parseFloat(t0) && parseFloat(parseFloat(time).toFixed(2)) < parseFloat(t0)) {
        // console.log(time, t0);
        continue;
      }

      let trim = -1;
      if (
        item.nextElementSibling &&
        item.nextElementSibling.classList.contains('hyperaudio-effect') &&
        item.nextElementSibling.getAttribute('data-type') === 'trim'
      ) {
        trim = parseFloat(item.nextElementSibling.getAttribute('data-value'));
        if (isNaN(trim)) trim = -1;
      }

      if (
        item.nextElementSibling &&
        item.nextElementSibling.nextElementSibling &&
        item.nextElementSibling.nextElementSibling.classList.contains('hyperaudio-effect') &&
        item.nextElementSibling.nextElementSibling.getAttribute('data-type') === 'trim'
      ) {
        trim = parseFloat(item.nextElementSibling.nextElementSibling.getAttribute('data-value'));
        if (isNaN(trim)) trim = -1;
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

      if (
        item.nextElementSibling &&
        item.nextElementSibling.nextElementSibling &&
        item.nextElementSibling.nextElementSibling.classList.contains('hyperaudio-effect') &&
        item.nextElementSibling.nextElementSibling.getAttribute('data-type') === 'fade'
      ) {
        fade = parseFloat(item.nextElementSibling.nextElementSibling.getAttribute('data-value'));
        if (isNaN(fade)) fade = 0;
      }

      const [ti, di] = last.getAttribute('data-t').split(',');
      // if (time > parseFloat(ti) + parseFloat(di) + trim) continue;
      if (time > parseFloat(ti) + (trim > -1 ? trim : parseFloat(di))) continue;

      if (fade > 0 && time > parseFloat(ti) + parseFloat(di) - fade) {
        const media = this.getMedia(src);
        if (media && !media.classList.contains('hyperaudio-fade')) {
          media.classList.add('hyperaudio-fade');
          media.style.transition = `opacity ${parseFloat(ti) + parseFloat(di) - time}s ease-in-out`;
          media.style.opacity = '0';
          // setTimeout(() => {
          //   media.style.transition = 'none';
          //   media.classList.remove('hyperaudio-fade');
          // }, 1000 * (parseFloat(ti) + parseFloat(di) - time));
        }
      }

      found = true;
      this.lastSegment = item;

      for (let i = 0; i < candidates.length; i++) {
        const tc = candidates[i].getAttribute('data-t');
        let [t, d] = tc.split(',');
        t = parseFloat(t);
        // d = parseFloat(d) + (i === candidates.length - 1 ? trim : 0);
        d = parseFloat(d);
        if (i === candidates.length - 1 && trim > -1) d = trim;

        if (t < time) {
          tokenFound = true;
          candidates[i].classList.add('hyperaudio-past');
        }

        if (t <= time && time < t + d) {
          tokenFound = true;
          exactTokenFound = true;
          candidates[i].classList.add('hyperaudio-past');

          if (!candidates[i].parentElement.classList.contains('hyperaudio-scroll')) {
            //  && !this.root.querySelector('.velocity-animating')
            // if (!candidates[i].classList.contains('hyperaudio-scroll')) {
            candidates[i].parentElement.classList.add('hyperaudio-scroll');
            // candidates[i].classList.add('hyperaudio-scroll');
            // if (jQuery && jQuery.Velocity) {
            // if (jQuery) {
            //   // jQuery.Velocity(candidates[i].parentElement, 'scroll', {
            //   //   duration: 500,
            //   //   delay: 0,
            //   //   easing: 'ease-in-out',
            //   //   container: this.root.querySelector('article'),
            //   //   offset: - jQuery(this.root.querySelector('article')).scrollTop() + (this.root.querySelector('.hyperaudio-title') ? jQuery(this.root.querySelector('.hyperaudio-title')).height() : 0)
            //   // });
            //   const $scrollingContainer = jQuery(this.root.querySelector('article'));
            //   const vpHeight = $scrollingContainer.height();
            //   const scrollTop = $scrollingContainer.scrollTop();
            //   const link = jQuery(candidates[i].parentElement);
            //   const position = link.position();
            //
            //   this.scrolling = true;
            //   $scrollingContainer.animate({
            //     scrollTop: (position.top + scrollTop),
            //     start: () => { this.scrolling = true; },
            //     always: () => { this.scrolling = false; }
            //   }, 500);
            // } else {
              candidates[i].parentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            // }
            Array.from(this.root.querySelectorAll('p.hyperaudio-scroll')).filter(s => s !== candidates[i].parentElement).forEach(s => s.classList.remove('hyperaudio-scroll'));
            // Array.from(this.root.querySelectorAll('.hyperaudio-scroll')).filter(s => s !== candidates[i]).forEach(s => s.classList.remove('hyperaudio-scroll'));
          } else {
            const aRect = this.root.querySelector('article').getBoundingClientRect();
            const fold = aRect.height + aRect.y;
            const rect = candidates[i].getBoundingClientRect();
            if (rect.y > fold && !candidates[i].classList.contains('hyperaudio-scroll')) { // FIXME
              //  && !this.root.querySelector('.velocity-animating')
              candidates[i].classList.add('hyperaudio-scroll');
              // if (jQuery && jQuery.Velocity) {
              // if (jQuery) {
              //   // jQuery.Velocity(candidates[i], 'scroll', {
              //   //   duration: 500,
              //   //   delay: 0,
              //   //   easing: 'ease-in-out',
              //   //   container: this.root.querySelector('article'),
              //   //   offset: - jQuery(this.root.querySelector('article')).scrollTop() + jQuery(this.root.querySelector('.hyperaudio-title')).height()
              //   // });
              //   const $scrollingContainer = jQuery(this.root.querySelector('article'));
              //   const vpHeight = $scrollingContainer.height();
              //   const scrollTop = $scrollingContainer.scrollTop();
              //   const link = jQuery(candidates[i]);
              //   const position = link.position();
              //   this.scrolling = true;
              //   $scrollingContainer.animate({
              //     scrollTop: (position.top + scrollTop),
              //     start: () => { this.scrolling = true; },
              //     always: () => { this.scrolling = false; }
              //   }, 500);
              // } else {
                candidates[i].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              // }
              Array.from(this.root.querySelectorAll('span.hyperaudio-scroll')).filter(s => s !== candidates[i]).forEach(s => s.classList.remove('hyperaudio-scroll'));
            }
          }
        }

        if (t > time) break;
      }
    }

    if (!found) {
      const media = this.getMedia(src);
      media.pause();

      const allItems = this.root.querySelectorAll('.hyperaudio-transcript');
      // console.log('not found, items', allItems);
      for (let k = 0; k < allItems.length - 1; k++) {
        if (allItems[k] === this.lastSegment) {
          found = true;
          // console.log('last item', allItems[k]);
          const event = document.createEvent('HTMLEvents');
          event.initEvent('click', true, false);
          // console.log('NEXT item', allItems[k + 1]);
          // setTimeout(() => {
          allItems[k + 1].querySelector('*[data-t]').dispatchEvent(event);
          // }, 250);
          break;
        }
      }

      if (!found) this.progress(time);

      if (!found) allItems[allItems.length - 1].classList.remove('hyperaudio-current');
    } else {
      this.progress(time);
    }
  }

  play() {
    const media = Array.from(this.root.querySelectorAll('video, audio')).find(el => el.style.display !== 'none');
    if (!this.root.querySelector('.hyperaudio-current') && this.root.querySelector('.hyperaudio-transcript')) {
      // this.root.querySelector('.hyperaudio-transcript').classList.add('hyperaudio-current');
      const event = document.createEvent('HTMLEvents');
      event.initEvent('click', true, false);
      this.root.querySelector('.hyperaudio-transcript').querySelector('*[data-t]').dispatchEvent(event);
    } else if (this.root.querySelector('.hyperaudio-current.hyperaudio-transcript')) {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('click', true, false);

      const pastWords = this.root.querySelectorAll('.hyperaudio-current.hyperaudio-transcript .hyperaudio-past');
      if (pastWords && pastWords.length > 0) {
        Array.from(pastWords).pop().dispatchEvent(event);
      } else {
        this.root.querySelector('.hyperaudio-current.hyperaudio-transcript').querySelector('*[data-t]').dispatchEvent(event);
      }
    } else if (media) {
      const src = media.getAttribute('data-src');
      document
        .querySelectorAll(`video, audio`)
        .forEach(media2 => {
          if (media !== media2) media2.pause();
        });
      media.play();
    }
  }

  pause(skipCurrent) {
    if (skipCurrent) {
      const media = Array.from(this.root.querySelectorAll('video, audio')).find(el => el.style.display !== 'none');
      if (media) media.pause();
    } else {
      this.root
        .querySelectorAll(`video, audio`)
        .forEach(media => media2.pause());
    }
  }

  onSeek(event: Object) {
    let element = event.target;
    if (element.classList.contains('hyperaudio-progress-bar')) element = element.parentElement;
    const { x, width } = element.getClientRects()[0];
    // console.log(x, width, event.clientX, element);
    const progress = (event.clientX - x) / width;

    const sections = Array.from(this.root.querySelectorAll('section[data-duration]'));
    const duration = sections.reduce((acc, section) => acc + parseFloat(section.getAttribute('data-duration'), 10), 0);
    const time = progress * duration;

    let localTime = 0;
    const targetSection = sections.find((section, index) => {
      const timeOffset = sections.slice(0, index).reduce((acc, section) => acc + parseFloat(section.getAttribute('data-duration'), 10), 0);
      localTime = time - timeOffset + parseFloat(section.getAttribute('data-start'), 10);
      // console.log(time, timeOffset, localTime, section);
      return localTime >= parseFloat(section.getAttribute('data-start'), 10) && localTime < parseFloat(section.getAttribute('data-end'), 10);
    });

    // console.log(time, targetSection);
    if (!targetSection) return;

    const click = document.createEvent('HTMLEvents');
    click.initEvent('click', true, false);
    // targetSection.querySelector('*[data-t]').dispatchEvent(click);

    const targetToken = Array.from(targetSection.querySelectorAll('*[data-t]')).find(token => parseFloat(token.getAttribute('data-t'), 10) >= localTime);
    // console.log(time, localTime, targetToken);
    targetToken.dispatchEvent(click);
    // targetToken.scrollIntoView({ behavior: 'smooth' });
  }

  formatTime(time) {
    if (time < 0) return '00:00';
    let h = 0;
    let m = 0;
    let s = 0;
    if (time >= 3600) {
      h = Math.floor(time / 3600);
      time = time - (h * 3600);
    }
    if (time >= 60) {
      m = Math.floor(time / 60);
      time = time - (m * 60);
    }
    s = Math.floor(time);

    if (m < 10) m = `0${m}`;
    if (s < 10) s = `0${s}`;

    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
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

    const durationEl = this.root.querySelector('.hyperaudio-duration');
    if (durationEl) durationEl.textContent = `/ ${this.formatTime(duration)}`;
    const timeEl = this.root.querySelector('.hyperaudio-elapsed');

    // let currentIndex = sections.findIndex(section => section.classList.contains('hyperaudio-current'));
    let currentIndex = sections.findIndex(section => section === this.lastSegment);
    // if (currentIndex === -1 && media) currentIndex = sections.findIndex(section => section.getAttribute('data-src') === media.getAttribute('data-src'));
    const bar = this.root.querySelector('.hyperaudio-progress-bar');
    if (currentIndex > -1) {
      const currentSection = sections[currentIndex];
      const start = parseFloat(currentSection.getAttribute('data-start'), 10);
      const duration2 = sections.slice(0, currentIndex).reduce((acc, section) => acc + parseFloat(section.getAttribute('data-duration'), 10), 0);
      let progress = time - start + duration2;
      // console.log(progress * 100 / duration, time, start, duration2, duration);
      if (timeEl) timeEl.textContent = this.formatTime(progress);

      progress = progress * 100 / duration;
      if (progress > 100) progress = 100;
      // dampen progress
      // if (progress > this.prevProgress + 10) {
      //   progress = (progress + this.prevProgress) / 2;
      // }
      this.prevProgress = progress;

      if (bar) bar.style.width = `${parseFloat(progress).toFixed(1)}%`;
    } else {
      if (bar && this.lastSegment) {
        bar.style.width = '100%';
        // bar.style.width = '0%';
      } else {
        bar.style.width = '0%';
      }
    }
  }

  onTimeUpdate(event: Object) {
    if (this.lockTimeUpdate) return;
    if (!event.target.classList.contains('hyperaudio-enabled')) return;
    if (!event.target.classList.contains('hyperaudio-seeked')) {
      event.target.classList.add('hyperaudio-seeked');
    }

    const time = event.target.currentTime;
    const src = event.target.getAttribute('data-src');
    if (!this.currentSrc || this.currentSrc === src) this.setHead(time, src);
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

    if (this.root.querySelector('.hyperaudio-current.hyperaudio-transcript')) {
      const activeMedia = Array.from(this.root.querySelectorAll('video, audio')).find(el => el.style.display !== 'none');
      if (activeMedia) {
        media.style.display = 'none';
        media.style.opacity = '1';
        header.appendChild(media);
      } else {
        header.insertBefore(media, header.firstChild);
      }
    } else {
      header.insertBefore(media, header.firstChild);
    }

    return media;
  }

  getMedia(src: string, type: string) {
    const media = this.findMedia(src) || this.createMedia(src, type);

    if (media && !(this.root.querySelector('.hyperaudio-current.hyperaudio-transcript') && !media.classList.contains('hyperaudio-enabled'))) {
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
          // media.play();
          this.play();
          // document
          //   .querySelectorAll(`video:not([src="${src}"]), audio:not([src="${src}"])`)
          //   .forEach(media2 => {
          //     // flow-disable-next-line
          //     media2.pause();
          //   });
        } else {
          // media.pause();
          this.pause(true);
        }
      });
      media.setAttribute('data-src', src);

      media.addEventListener('loadedmetadata', (event) => {
        const item = this.root.querySelector(`.hyperaudio-transcript[data-src="${src}"]`);
        const first = item.querySelector('span[data-t]');
        const start = parseFloat(first.getAttribute('data-t').split(',')[0]);
        media.currentTime = start;
      });

      media.addEventListener('play', (event) => {
        // if (event.target.style.display !== 'none') return;
        const t = this.root.querySelector(`.hyperaudio-transport`);
        t.classList.add('hyperaudio-playing');
        if (!this.root.querySelector('.hyperaudio-current') && this.root.querySelector('.hyperaudio-transcript')) {
          this.root.querySelector('.hyperaudio-transcript').classList.add('hyperaudio-current');
        }
      });

      media.addEventListener('pause', (event) => {
        // if (event.target.style.display !== 'none') return;
        const t = this.root.querySelector(`.hyperaudio-transport`);
        t.classList.remove('hyperaudio-playing');
      });


      media.classList.add('hyperaudio-enabled');
    }

    return media;
  }
}
