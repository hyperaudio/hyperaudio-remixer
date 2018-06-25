'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* eslint-disable class-methods-use-this, no-param-reassign */

var templates = exports.templates = {
  trim: '<section class="hyperaudio-effect" data-type="trim" data-value="1"><label><div>Trim</div><div class="hyperaudio-range"><input type="range" value="1" min="0.5" max="7" step="0.1"></div><div><span>1</span>s</div></label></section>',
  fade: '<section class="hyperaudio-effect" data-type="fade" data-value="1"><label><div>Fade</div><div class="hyperaudio-range"><input type="range" value="1" min="0.5" max="7" step="0.1"></div><div><span>1</span>s</div></label></section>'
};

var Sink = function (_Player) {
  _inherits(Sink, _Player);

  function Sink(rootNodeOrSelector) {
    var itemSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.hyperaudio-transcript, .hyperaudio-effect';

    _classCallCheck(this, Sink);

    var _this = _possibleConstructorReturn(this, (Sink.__proto__ || Object.getPrototypeOf(Sink)).call(this, rootNodeOrSelector, itemSelector));

    if (_this.root.querySelector(_this.itemSelector)) {
      // flow-disable-next-line
      var collection = _this.root.querySelector(_this.itemSelector).parentElement;
      if (collection) {
        collection.addEventListener('dragover', _this.onDragOver.bind(_this));
        collection.addEventListener('dragenter', _this.onDragEnter.bind(_this));
        collection.addEventListener('dragend', _this.onDragEnd.bind(_this));
        collection.addEventListener('drop', _this.onDrop.bind(_this));
        // collection.addEventListener('dragleave', this.onDragLeave.bind(this));
      }
    }

    _this.root.querySelectorAll('.hyperaudio-effect-source').forEach(function (button) {
      var type = button.getAttribute('data-type') || 'trim';
      var html = templates[type];
      button.setAttribute('draggable', 'true');
      button.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/html', html);
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.dropEffect = 'copy';
      });
    });
    return _this;
  }

  _createClass(Sink, [{
    key: 'setup',
    value: function setup(item) {
      var _this2 = this;

      _get(Sink.prototype.__proto__ || Object.getPrototypeOf(Sink.prototype), 'setup', this).call(this, item);

      item.setAttribute('draggable', 'true');
      item.setAttribute('tabindex', 0);
      item.addEventListener('mousedown', this.onMouseDown.bind(this));
      item.addEventListener('dragstart', this.onDragStart.bind(this));
      item.addEventListener('dragend', this.onDragEnd2.bind(this));

      if (item.classList.contains('hyperaudio-effect') && item.querySelector('input')) {
        if (jQuery && jQuery('input[type="range"]').rangeslider) {
          // if (item.querySelector('.rangeslider')) jQuery(item).find('.rangeslider').remove();
          jQuery('input[type="range"]').rangeslider({
            polyfill: false,
            onSlide: function onSlide(position, value) {
              item.querySelector('span').innerText = value;
              event.target.setAttribute('value', value);
              item.setAttribute('data-value', value);
              _this2.exposeURL();
            }
          });
        } else {
          item.querySelector('input').addEventListener('input', function (event) {
            var value = event.target.value;
            item.querySelector('span').innerText = value;
            event.target.setAttribute('value', value);
            item.setAttribute('data-value', value);
            _this2.exposeURL();
          });
        }
      }

      this.exposeURL();
    }
  }, {
    key: 'exposeURL',
    value: function exposeURL() {
      var data = [];
      this.root.querySelector('article').querySelectorAll(this.itemSelector).forEach(function (item) {
        if (item.classList.contains('hyperaudio-effect')) {
          data.push({
            mode: 'effect',
            type: item.getAttribute('data-type'),
            value: item.getAttribute('data-value')
          });
        } else {
          var first = item.querySelector('span[data-t]');
          var last = Array.from(item.querySelectorAll('span[data-t]:last-child')).pop();

          var start = parseFloat(first.getAttribute('data-t').split(',')[0]);
          var end = parseFloat(last.getAttribute('data-t').split(',').map(function (v) {
            return parseFloat(v);
          }).reduce(function (acc, v) {
            return v + acc;
          }));
          data.push({
            mode: 'transcript',
            id: item.getAttribute('data-id'),
            start: start, end: end,
            prefix: Array.from(item.querySelectorAll('span[data-t]')).slice(0, 3).map(function (t) {
              var root = t.textContent.replace(/[^\w\s]|_/g, '').replace(/\s+/g, '').toLowerCase().trim();
              return '' + root.substr(0, 1).toUpperCase() + root.substr(1, 3);
            }),
            suffix: Array.from(item.querySelectorAll('span[data-t]')).reverse().slice(0, 3).reverse().map(function (t) {
              var root = t.textContent.replace(/[^\w\s]|_/g, '').replace(/\s+/g, '').toLowerCase().trim();
              return '' + root.substr(0, 1).toUpperCase() + root.substr(1, 3);
            })
          });
        }
      });
      // console.log(data);

      var fragments = data.reduce(function (acc, segment) {
        if (segment.mode === 'effect') {
          if (segment.value) {
            var prevSegment = acc.pop();
            return [].concat(_toConsumableArray(acc), [prevSegment + ':' + (segment.type === 'fade' ? 'f' : 't') + segment.value]);
          }
          return [].concat(_toConsumableArray(acc));
        }

        return [].concat(_toConsumableArray(acc), [segment.id + ':' + segment.start + ',' + segment.end]);
      }, []).filter(function (fragment) {
        return !fragment.startsWith('undef');
      });
      // console.log(fragments);

      var anchors = data.reduce(function (acc, segment) {
        if (segment.mode === 'effect') return [].concat(_toConsumableArray(acc));

        return [].concat(_toConsumableArray(acc), [segment.id + ':' + segment.prefix.join('') + ',' + segment.suffix.join('')]);
      }, []).filter(function (fragment) {
        return !fragment.startsWith('undef');
      });
      // console.log(anchors);

      window.history.replaceState({}, document.title, '?r=' + fragments.join(';') + '&a=' + anchors.join(';'));
      window.HyperaudioURL = window.location.href;
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(event) {
      this.target = event.target;
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(event) {
      if (event.target.classList.contains('hyperaudio-effect') && this.target && this.target.nodeName === 'INPUT') {
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
  }, {
    key: 'onDragEnd2',
    value: function onDragEnd2(event) {
      event.target.remove();
    }
  }, {
    key: 'onDragOver',
    value: function onDragOver(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, {
    key: 'onDragEnter',
    value: function onDragEnter(event) {
      event.preventDefault();
      event.stopPropagation();

      this.root.querySelectorAll('.hyperaudio-over:not(article)').forEach(function (item) {
        return item.classList.remove('hyperaudio-over');
      });

      var target = event.target;
      if (typeof target.matches !== 'function') return;
      while (target && typeof target.matches === 'function' && !target.matches(this.itemSelector + '[draggable]')) {
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

  }, {
    key: 'onDragEnd',
    value: function onDragEnd() {
      this.root.querySelectorAll('.hyperaudio-over').forEach(function (item) {
        return item.classList.remove('hyperaudio-over');
      });
    }
  }, {
    key: 'onDrop',
    value: function onDrop(event) {
      event.preventDefault();
      var html = event.dataTransfer.getData('text/html');

      var target = event.target;

      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;

      // flow-disable-next-line
      if (wrapper.querySelector('meta')) wrapper.querySelector('meta').remove();

      var item = wrapper.children[0];

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
        while (target && typeof target.matches === 'function' && !target.matches(this.itemSelector + '[draggable]')) {
          target = target.parentElement;
        }

        target.parentElement.insertBefore(item, target);
        this.setup(item);
      }

      // this.root
      document // FIXME
      .querySelectorAll('.hyperaudio-source > section').forEach(function (section) {
        return section.remove();
      });

      this.onDragEnd();
    }
  }]);

  return Sink;
}(_player2.default);

exports.default = Sink;