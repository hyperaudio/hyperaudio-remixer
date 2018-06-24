'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable class-methods-use-this, no-unused-vars, no-plusplus, no-continue, no-param-reassign */

var Player = function () {
  function Player(rootNodeOrSelector) {
    var _this = this;

    var itemSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.hyperaudio-transcript, .hyperaudio-effect';

    _classCallCheck(this, Player);

    this.itemSelector = itemSelector;
    this.root = typeof rootNodeOrSelector === 'string' ? document.querySelector(rootNodeOrSelector) || document.createElement('section') : rootNodeOrSelector;

    if (this.root.querySelector(this.itemSelector)) {
      // flow-disable-next-line
      Array.from(this.root.querySelector(this.itemSelector).parentElement.querySelectorAll(this.itemSelector)).reverse().forEach(function (item) {
        return _this.setup(item);
      });

      // flow-disable-next-line
      this.root.querySelector(this.itemSelector).parentElement.addEventListener('click', this.onClick.bind(this));
    }

    this.root.querySelector('.hyperaudio-progress').addEventListener('click', this.onSeek.bind(this));
  }

  _createClass(Player, [{
    key: 'setup',
    value: function setup(item) {
      var src = item.getAttribute('data-src');
      var type = item.getAttribute('data-type');

      if (src) this.getMedia(src, type);

      // data-m?
      item.querySelectorAll('*[data-m]').forEach(function (element) {
        var m = element.getAttribute('data-m');
        var d = element.getAttribute('data-d');
        var t = [];

        if (m) t.push(parseInt(m, 10) / 1000);
        if (d) t.push(parseInt(d, 10) / 1000);

        element.setAttribute('data-t', t.join(','));
        element.removeAttribute('data-m');
        element.removeAttribute('data-d');
        element.removeAttribute('class');
        element.parentElement.removeAttribute('class');
      });

      var tokens = Array.from(item.querySelectorAll('*[data-t]'));
      if (tokens.length > 0) {
        var start = parseFloat(tokens[0].getAttribute('data-t').split(',').reverse().pop(), 10);
        var end = tokens[tokens.length - 1].getAttribute('data-t').split(',').reduce(function (acc, v) {
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

  }, {
    key: 'onClick',
    value: function onClick(event) {
      var t = event.target.getAttribute('data-t');
      if (!t) return;

      var item = event.target.parentElement;
      while (item && !item.matches(this.itemSelector)) {
        item = item.parentElement;
      }if (!item) return;

      var src = item.getAttribute('data-src');
      if (!src) return;

      // FIXME
      // flow-disable-next-line
      var media = this.getMedia(src);
      if (!media) return;

      this.root.querySelectorAll('.hyperaudio-current').forEach(function (active) {
        return active.classList.remove('hyperaudio-current');
      });
      item.classList.add('hyperaudio-current');

      var _t$split = t.split(','),
          _t$split2 = _slicedToArray(_t$split, 2),
          start = _t$split2[0],
          duration = _t$split2[1];
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
  }, {
    key: 'setHead',
    value: function setHead(time, src) {
      this.currentSrc = src;
      var found = false;

      var items = this.root.querySelectorAll('.hyperaudio-transcript[data-src="' + src + '"]');

      for (var j = 0; j < items.length; j++) {
        var item = items[j];

        item.querySelectorAll('.hyperaudio-past').forEach(function (active) {
          return active.classList.remove('hyperaudio-past');
        });
        // item
        //   .querySelectorAll('.hyperaudio-active')
        //   .forEach(active => active.classList.remove('hyperaudio-active'));

        var candidates = item.querySelectorAll('*[data-t]');

        var first = candidates[0];
        var last = candidates[candidates.length - 1];

        // flow-disable-next-line

        var _first$getAttribute$s = first.getAttribute('data-t').split(','),
            _first$getAttribute$s2 = _slicedToArray(_first$getAttribute$s, 1),
            t0 = _first$getAttribute$s2[0];

        if (time < parseFloat(t0)) continue;

        var trim = 0;
        if (item.nextElementSibling && item.nextElementSibling.classList.contains('hyperaudio-effect') && item.nextElementSibling.getAttribute('data-type') === 'trim') {
          trim = parseFloat(item.nextElementSibling.getAttribute('data-value'));
          if (isNaN(trim)) trim = 0;
        }

        var fade = 0;
        if (item.nextElementSibling && item.nextElementSibling.classList.contains('hyperaudio-effect') && item.nextElementSibling.getAttribute('data-type') === 'fade') {
          fade = parseFloat(item.nextElementSibling.getAttribute('data-value'));
          if (isNaN(fade)) fade = 0;
        }

        // flow-disable-next-line

        var _last$getAttribute$sp = last.getAttribute('data-t').split(','),
            _last$getAttribute$sp2 = _slicedToArray(_last$getAttribute$sp, 2),
            ti = _last$getAttribute$sp2[0],
            di = _last$getAttribute$sp2[1];

        if (time > parseFloat(ti) + parseFloat(di) + trim) continue;

        if (time > parseFloat(ti) + parseFloat(di) - fade) {
          var media = this.getMedia(src);
          if (media && !media.classList.contains('hyperaudio-fade')) {
            media.classList.add('hyperaudio-fade');
            media.style.transition = 'opacity ' + (parseFloat(ti) + parseFloat(di) - time) + 's ease-in-out';
            media.style.opacity = '0';
          }
        }

        found = true;
        this.lastSegment = item;

        for (var i = 0; i < candidates.length; i++) {
          var tc = candidates[i].getAttribute('data-t');
          // flow-disable-next-line

          var _tc$split = tc.split(','),
              _tc$split2 = _slicedToArray(_tc$split, 2),
              t = _tc$split2[0],
              d = _tc$split2[1];

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
        var _media = this.getMedia(src);
        // flow-disable-next-line
        _media.pause();

        var allItems = this.root.querySelectorAll('.hyperaudio-transcript');
        for (var k = 0; k < allItems.length - 1; k++) {
          if (allItems[k] === this.lastSegment) {
            var event = document.createEvent('HTMLEvents');
            event.initEvent('click', true, false);
            // flow-disable-next-line
            allItems[k + 1].querySelector('*[data-t]').dispatchEvent(event);
            break;
          }
        }
      }
      this.progress(time);
    }
  }, {
    key: 'onSeek',
    value: function onSeek(event) {
      var element = event.target;
      if (element.classList.contains('hyperaudio-progress-bar')) element = element.parentElement;
      var _element$getClientRec = element.getClientRects()[0],
          x = _element$getClientRec.x,
          width = _element$getClientRec.width;

      console.log(x, width, event.clientX, element);
      var progress = (event.clientX - x) / width;

      var sections = Array.from(this.root.querySelectorAll('section[data-duration]'));
      var duration = sections.reduce(function (acc, section) {
        return acc + parseFloat(section.getAttribute('data-duration'), 10);
      }, 0);
      var time = progress * duration;

      var localTime = 0;
      var targetSection = sections.find(function (section, index) {
        var timeOffset = sections.slice(0, index).reduce(function (acc, section) {
          return acc + parseFloat(section.getAttribute('data-duration'), 10);
        }, 0);
        localTime = time - timeOffset + parseFloat(section.getAttribute('data-start'), 10);
        console.log(time, timeOffset, localTime, section);
        return localTime >= parseFloat(section.getAttribute('data-start'), 10) && localTime < parseFloat(section.getAttribute('data-end'), 10);
      });

      console.log(time, targetSection);
      if (!targetSection) return;

      var click = document.createEvent('HTMLEvents');
      click.initEvent('click', true, false);
      // targetSection.querySelector('*[data-t]').dispatchEvent(click);

      var targetToken = Array.from(targetSection.querySelectorAll('*[data-t]')).find(function (token) {
        return parseFloat(token.getAttribute('data-t'), 10) >= localTime;
      });
      console.log(time, localTime, targetToken);
      targetToken.dispatchEvent(click);
    }
  }, {
    key: 'progress',
    value: function progress(time) {
      // hyperaudio-progress-bar
      var sections = Array.from(this.root.querySelectorAll('section[data-duration]'));
      var duration = sections.reduce(function (acc, section) {
        return acc + parseFloat(section.getAttribute('data-duration'), 10);
      }, 0);
      var media = Array.from(this.root.querySelectorAll('video, audio')).find(function (el) {
        return el.style.display !== 'none';
      });
      if (time === null) {
        time = 0;
        if (media) time = media.currentTime;
      }

      var currentIndex = sections.findIndex(function (section) {
        return section.classList.contains('hyperaudio-current');
      });
      if (currentIndex === -1 && media) currentIndex = sections.findIndex(function (section) {
        return section.getAttribute('data-src') === media.getAttribute('data-src');
      });
      // console.log(duration, currentIndex);
      var bar = this.root.querySelector('.hyperaudio-progress-bar');
      if (currentIndex > -1) {
        var currentSection = sections[currentIndex];
        var progress = time - parseFloat(currentSection.getAttribute('data-start'), 10) + sections.slice(0, currentIndex).reduce(function (acc, section) {
          return acc + parseFloat(section.getAttribute('data-duration'), 10);
        }, 0);
        // console.log(duration, progress);
        progress = progress * 100 / duration;
        if (progress > 100) progress = 100;
        if (bar) bar.style.width = progress + '%';
      } else {
        if (bar) bar.style.width = '0%';
      }
    }
  }, {
    key: 'onTimeUpdate',
    value: function onTimeUpdate(event) {
      var time = event.target.currentTime;
      var src = event.target.getAttribute('data-src');
      this.setHead(time, src);
    }
  }, {
    key: 'findMedia',
    value: function findMedia(src) {
      var media = this.root.querySelector('video[src="' + src + '"], audio[src="' + src + '"]');
      if (!media) {
        var source = this.root.querySelector('source[src="' + src + '"], source[src="' + src + '"]');
        if (source) media = source.parentElement;
      }

      return media;
    }
  }, {
    key: 'hideOtherMediaThan',
    value: function hideOtherMediaThan(src) {
      this.root.querySelectorAll('video:not([src="' + src + '"]), audio:not([src="' + src + '"])').forEach(function (media) {
        // flow-disable-next-line
        media.pause();
        media.style.display = 'none';
        media.style.opacity = '1';
        media.classList.remove('hyperaudio-fade');
      });
      // mute all other media
      document.querySelectorAll('video:not([src="' + src + '"]), audio:not([src="' + src + '"])').forEach(function (media) {
        // flow-disable-next-line
        media.pause();
      });
    }
  }, {
    key: 'createMedia',
    value: function createMedia(src, type) {
      var wrapper = document.createElement('div');

      var poster = null;
      var section = this.root.querySelector('.hyperaudio-transcript[data-src="' + src + '"]');
      if (section && section.getAttribute('data-poster')) poster = section.getAttribute('data-poster');

      switch (type.split('/').splice(0, 1).pop()) {
        case 'audio':
          wrapper.innerHTML = '<audio src="' + src + '" type="' + type + '" preload></audio>';
          break;

        default:
          wrapper.innerHTML = '<video src="' + src + '" type="' + type + '" preload playsinline></video>';
      }

      var media = wrapper.querySelector('audio, video');
      if (poster) media.setAttribute('poster', poster);
      // flow-disable-next-line
      // this.root.querySelector('header').appendChild(media);
      var header = this.root.querySelector('header');
      header.insertBefore(media, header.firstChild);

      return media;
    }
  }, {
    key: 'getMedia',
    value: function getMedia(src, type) {
      var _this2 = this;

      var media = this.findMedia(src) || this.createMedia(src, type);

      if (media) {
        this.hideOtherMediaThan(src);
        // flow-disable-next-line
        media.style.display = '';
        // flow-disable-next-line
        // media.style.opacity = '1';
      }

      if (media && !media.classList.contains('hyperaudio-enabled')) {
        media.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
        media.addEventListener('click', function () {
          if (media.paused) {
            media.play();
            document.querySelectorAll('video:not([src="' + src + '"]), audio:not([src="' + src + '"])').forEach(function (media2) {
              // flow-disable-next-line
              media2.pause();
            });
          } else {
            media.pause();
          }
        });
        media.setAttribute('data-src', src);

        media.addEventListener('loadedmetadata', function (event) {
          var item = _this2.root.querySelector('.hyperaudio-transcript[data-src="' + src + '"]');
          var first = item.querySelector('span[data-t]');
          var start = parseFloat(first.getAttribute('data-t').split(',')[0]);
          media.currentTime = start;
        });

        media.classList.add('hyperaudio-enabled');
      }

      return media;
    }
  }]);

  return Player;
}();

exports.default = Player;