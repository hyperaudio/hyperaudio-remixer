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
/* eslint-disable class-methods-use-this */

var Source = function (_Player) {
  _inherits(Source, _Player);

  function Source(rootNodeOrSelector) {
    var itemSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.hyperaudio-transcript, .hyperaudio-effect';

    _classCallCheck(this, Source);

    var _this = _possibleConstructorReturn(this, (Source.__proto__ || Object.getPrototypeOf(Source)).call(this, rootNodeOrSelector, itemSelector));

    document.addEventListener('selectionchange', _this.onSelectionChange.bind(_this));
    document.addEventListener('mouseup', _this.onMouseUp.bind(_this));
    return _this;
  }

  _createClass(Source, [{
    key: 'onSelectionChange',
    value: function onSelectionChange() {
      var selection = window.getSelection();
      if (selection.rangeCount === 0) return;

      var range = selection.getRangeAt(0);
      var commonAncestor = range.commonAncestorContainer;

      // document.TEXT_NODE
      if (commonAncestor.nodeType === 3) {
        range.setStartBefore(commonAncestor.parentNode);
        return;
      }

      if (!(commonAncestor.matches('section[data-src]') || commonAncestor.parentNode.matches('section[data-src]'))) return;

      // flow-disable-next-line
      this.root.querySelectorAll('.selected').forEach(function (selected) {
        if (selection.containsNode(selected, true) || selection.containsNode(selected.parentNode, true)) return;
        selected.classList.remove('selected');
        selected.removeAttribute('draggable');
      });

      commonAncestor.querySelectorAll('*').forEach(function (candidate) {
        // FIXME
        if (selection.containsNode(candidate, true) && candidate.nodeName !== 'P') {
          candidate.classList.add('selected');
        }
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp() {
      var _this2 = this;

      var selection = window.getSelection();
      // flow-disable-next-line
      var selected = this.root.querySelectorAll('.selected');

      selected.forEach(function (node) {
        if (selection.containsNode(node, true) || selection.containsNode(node.parentNode, true)) {
          node.setAttribute('draggable', true);
          node.addEventListener('dragstart', _this2.onDragStart.bind(_this2));
          // node.addEventListener('dragend', this.onDragEnd.bind(this));
        } else {
          // console.log('kill', node);
          node.classList.remove('selected');
          node.removeAttribute('draggable');
        }
      });

      if (selected.length > 0 && selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        range.setStartBefore(selected.item(0));
        range.setEndAfter(selected.item(selected.length - 1));
      } else {
        selection.removeAllRanges();
      }
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart() /* event) */{
      // event.preventDefault();
      // event.stopPropagation();

      var item = document.createElement('section');
      var parent = document.createElement('p');
      item.appendChild(parent);
      var prevSelected = null;
      // flow-disable-next-line
      this.root.querySelectorAll('.selected').forEach(function (selected) {
        var clone = selected.cloneNode(true);
        clone.classList.remove('selected');
        clone.removeAttribute('draggable');
        if (prevSelected && prevSelected.parentNode !== selected.parentNode) {
          parent = document.createElement('p');
          item.appendChild(parent);
        }
        parent.appendChild(clone);
        prevSelected = selected;
      });

      // flow-disable-next-line
      event.dataTransfer.setData('html', item.outerHTML);
      // eslint-disable-next-line no-param-reassign flow-disable-next-line
      event.dataTransfer.effectAllowed = 'copy';
      // eslint-disable-next-line no-param-reassign flow-disable-next-line
      event.dataTransfer.dropEffect = 'copy';

      // return false;
    }

    // onDragEnd() {
    //   for (const node of this.node.querySelectorAll('.selected')) {
    //     node.classList.remove('selected');
    //     node.removeAttribute('draggable');
    //   }
    // }

  }]);

  return Source;
}(_player2.default);

exports.default = Source;