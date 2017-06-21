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

var Source = function (_Player) {
  _inherits(Source, _Player);

  function Source(rootNodeOrSelector) {
    var collectionSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'article';
    var itemSelector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'section';

    _classCallCheck(this, Source);

    var _this = _possibleConstructorReturn(this, (Source.__proto__ || Object.getPrototypeOf(Source)).call(this, rootNodeOrSelector));

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

      if (commonAncestor.nodeType === document.TEXT_NODE) {
        range.setStartBefore(commonAncestor.parentNode);
        return;
      }

      if (!(commonAncestor.matches('section[data-src]') || commonAncestor.parentNode.matches('section[data-src]'))) return;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.root.querySelectorAll('.selected')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var selected = _step.value;

          if (selection.containsNode(selected, true) || selection.containsNode(selected.parentNode, true)) continue;
          selected.classList.remove('selected');
          selected.removeAttribute('draggable');
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = commonAncestor.getElementsByTagName('*')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var candidate = _step2.value;

          if (selection.containsNode(candidate, true) && candidate.nodeName !== 'P') {
            candidate.classList.add('selected');
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp() {
      var selection = window.getSelection();
      var selected = this.root.querySelectorAll('.selected');

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = selected[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var node = _step3.value;

          if (selection.containsNode(node, true) || selection.containsNode(node.parentNode, true)) {
            node.setAttribute('draggable', true);
            node.addEventListener('dragstart', this.onDragStart.bind(this));
            // node.addEventListener('dragend', this.onDragEnd.bind(this));
          } else {
            // console.log('kill', node);
            node.classList.remove('selected');
            node.removeAttribute('draggable');
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

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
    value: function onDragStart(event) {
      // event.preventDefault();
      // event.stopPropagation();

      var item = document.createElement('section');
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.root.querySelectorAll('.selected')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var selected = _step4.value;

          var clone = selected.cloneNode(true);
          clone.classList.remove('selected');
          clone.removeAttribute('draggable');
          item.appendChild(clone);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      event.dataTransfer.setData('html', item.outerHTML);
      event.dataTransfer.effectAllowed = 'copy';
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

//# sourceMappingURL=source.js.map