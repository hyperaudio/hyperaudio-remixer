'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* eslint-disable class-methods-use-this, no-param-reassign */

var Source = function (_Player) {
  _inherits(Source, _Player);

  function Source(rootNodeOrSelector) {
    var itemSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.hyperaudio-transcript, .hyperaudio-effect';

    _classCallCheck(this, Source);

    var _this = _possibleConstructorReturn(this, (Source.__proto__ || Object.getPrototypeOf(Source)).call(this, rootNodeOrSelector, itemSelector));

    document.addEventListener('selectionchange', _this.onSelectionChange.bind(_this));

    // flow-disable-next-line
    var collection = _this.root.querySelector(_this.itemSelector).parentElement;
    if (collection && !collection.classList.contains('hyperaudio-enabled')) {
      collection.addEventListener('mouseup', _this.onMouseUp.bind(_this));
      collection.classList.add('hyperaudio-enabled');
    }
    return _this;
  }

  _createClass(Source, [{
    key: 'onSelectionChange',
    value: function onSelectionChange() {
      var selection = window.getSelection();
      if (selection.rangeCount === 0) return;

      var range = selection.getRangeAt(0);
      if (range.startOffset === range.endOffset) return;

      var commonAncestor = range.commonAncestorContainer;

      // document.TEXT_NODE
      if (commonAncestor.nodeType === 3) {
        range.setStartBefore(commonAncestor.parentElement);
        return;
      }

      if (!(commonAncestor.matches('section[data-src]') || commonAncestor.parentElement.matches('section[data-src]'))) return;

      commonAncestor.querySelectorAll('*').forEach(function (candidate) {
        // FIXME
        if (selection.containsNode(candidate, true) && candidate.nodeName !== 'P') {
          candidate.classList.add('hyperaudio-selected');
        } else {
          candidate.classList.remove('hyperaudio-selected');
        }
      });

      this.root.querySelectorAll('.hyperaudio-selected').forEach(function (selected) {
        if (selection.containsNode(selected, true) || selection.containsNode(selected.parentElement, true)) return;
        selected.classList.remove('hyperaudio-selected');
        selected.removeAttribute('draggable');
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp() {
      var _this2 = this;

      var selection = window.getSelection();
      var selected = this.root.querySelectorAll('.hyperaudio-selected');

      selected.forEach(function (node) {
        if (selection.containsNode(node, true) // ||
        // selection.containsNode(node.parentElement, true)
        ) {
            node.setAttribute('draggable', 'true');
            node.addEventListener('dragstart', _this2.onDragStart.bind(_this2));
            node.addEventListener('dragend', _this2.onDragEnd.bind(_this2));
          } else {
          // console.log('kill', node);
          node.classList.remove('hyperaudio-selected');
          node.removeAttribute('draggable');
        }
      });

      selection.removeAllRanges();

      // if (selected.length > 0 && selection.rangeCount > 0) {
      //   const range = selection.getRangeAt(0);
      //   range.setStartBefore(selected.item(0));
      //   range.setEndAfter(selected.item(selected.length - 1));
      // } else {
      //   selection.removeAllRanges();
      // }
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(event) {
      // event.preventDefault();
      // event.stopPropagation();

      var item = void 0;
      var parent = void 0;
      var prevSelected = void 0;
      this.root.querySelectorAll('.hyperaudio-selected').forEach(function (selected) {
        var clone = selected.cloneNode(true);
        clone.classList.remove('hyperaudio-selected');
        clone.classList.remove('hyperaudio-active');
        clone.classList.remove('hyperaudio-past');
        // clone.removeAttribute('class');
        clone.removeAttribute('draggable');

        // flow-disable-next-line
        if (!item) item = selected.parentElement.parentElement.cloneNode(false);
        if (!parent) {
          // flow-disable-next-line
          parent = selected.parentElement.cloneNode(false);
          // parent.removeAttribute('class');
          item.appendChild(parent);
        }

        if (prevSelected && prevSelected.parentElement !== selected.parentElement) {
          // flow-disable-next-line
          parent = selected.parentElement.cloneNode(false);
          item.appendChild(parent);
        }
        parent.appendChild(clone);
        prevSelected = selected;
      });

      // flow-disable-next-line
      event.dataTransfer.setData('text/html', item.outerHTML);
      // flow-disable-next-line
      event.dataTransfer.setData('text/plain', item.innerText);
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.dropEffect = 'copy';

      // flow-disable-next-line
      var itemClone = item.cloneNode(true);

      // itemClone.style.position = 'absolute';
      // itemClone.style.top = '0px';
      // itemClone.style.left = '-100px';
      // document.body.appendChild(itemClone);

      // FIXME
      this.root.appendChild(itemClone);
      event.dataTransfer.setDragImage(itemClone, 0, 0);
    }
  }, {
    key: 'onDragEnd',
    value: function onDragEnd() {
      this.root.querySelectorAll('.hyperaudio-selected').forEach(function (node) {
        node.classList.remove('hyperaudio-selected');
        node.removeAttribute('draggable');
      });
    }
  }]);

  return Source;
}(_player2.default);

exports.default = Source;