// @flow
/* eslint-disable class-methods-use-this, no-unused-vars */

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
  }

  setup(item: Object) {
    const src = item.getAttribute('data-src');
    const type = item.getAttribute('data-type');

    if (src) console.log(this.getMedia(src, type));
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

    return wrapper.querySelector('audio, video');
  }

  getMedia(src: string, type: string) {
    const media = this.findMedia(src) || this.createMedia(src, type);

    // flow-disable-next-line
    this.root.querySelector('header').appendChild(media);

    return media;
  }
}
