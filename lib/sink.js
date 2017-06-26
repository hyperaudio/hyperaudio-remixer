'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* eslint-disable class-methods-use-this */

var Sink = function (_Player) {
  _inherits(Sink, _Player);

  function Sink(rootNodeOrSelector) {
    var itemSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.hyperaudio-transcript, .hyperaudio-effect';

    _classCallCheck(this, Sink);

    // flow-disable-next-line
    var _this = _possibleConstructorReturn(this, (Sink.__proto__ || Object.getPrototypeOf(Sink)).call(this, rootNodeOrSelector, itemSelector));

    var collection = _this.root.querySelector(_this.itemSelector).parentNode;
    if (collection) {
      collection.addEventListener('dragover', _this.onDragOver.bind(_this));
      collection.addEventListener('dragenter', _this.onDragEnter.bind(_this));
      collection.addEventListener('dragend', _this.onDragEnd.bind(_this));
      collection.addEventListener('drop', _this.onDrop.bind(_this));
      // collection.addEventListener('dragleave', this.onDragLeave.bind(this));
    }
    return _this;
  }

  _createClass(Sink, [{
    key: 'setup',
    value: function setup(item) {
      _get(Sink.prototype.__proto__ || Object.getPrototypeOf(Sink.prototype), 'setup', this).call(this, item);

      item.setAttribute('draggable', 'true');
      item.setAttribute('tabindex', 0);
      item.addEventListener('dragstart', this.onDragStart.bind(this));
      item.addEventListener('dragend', this.onDragEnd2.bind(this));
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(event) {
      event.dataTransfer.setData('text/html', event.target.outerHTML);
      event.dataTransfer.setData('text/plain', event.target.innerText);
      // eslint-disable-next-line no-param-reassign
      event.dataTransfer.effectAllowed = 'copy';
      // eslint-disable-next-line no-param-reassign
      event.dataTransfer.dropEffect = 'copy';
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
        target = target.parentNode;
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

      // FIXME
      if (target.nodeName === 'DIV') target = target.parentNode;
      if (target.nodeName === 'ARTICLE') {
        // target.appendChild(item);
        target.insertBefore(item, target.querySelector('div'));
        this.setup(item);
      } else {
        // FIXME
        while (target && typeof target.matches === 'function' && !target.matches(this.itemSelector + '[draggable]')) {
          target = target.parentNode;
        }

        target.parentNode.insertBefore(item, target);
        this.setup(item);
      }

      this.onDragEnd();
    }
  }]);

  return Sink;
}(_player2.default);

exports.default = Sink;