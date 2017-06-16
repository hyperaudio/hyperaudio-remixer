'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function Player(nodeOrSelector) {
  _classCallCheck(this, Player);

  this.node = typeof nodeOrSelector === 'string' ? document.querySelector(nodeOrSelector) : nodeOrSelector;
};

var Source = function (_Player) {
  _inherits(Source, _Player);

  function Source(nodeOrSelector) {
    _classCallCheck(this, Source);

    var _this = _possibleConstructorReturn(this, (Source.__proto__ || Object.getPrototypeOf(Source)).call(this, nodeOrSelector));

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
        for (var _iterator = this.node.querySelectorAll('.selected')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var selected = _step.value;

          if (selection.containsNode(selected, true)) continue;
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
      var selected = this.node.querySelectorAll('.selected');

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = selected[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var node = _step3.value;

          if (selection.containsNode(node, true)) {
            node.setAttribute('draggable', true);
            node.addEventListener('dragstart', this.onDragStart.bind(this));
            node.addEventListener('dragend', this.onDragEnd.bind(this));
          } else {
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

      var range = selection.getRangeAt(0);
      if (selected.length > 0) {
        range.setStartBefore(selected.item(0));
        range.setEndAfter(selected.item(selected.length - 1));
      } else selection.removeAllRanges();
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(event) {
      event.dataTransfer.setData('nodes', this.node.querySelectorAll('.selected'));
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.dropEffect = 'copy';
    }
  }, {
    key: 'onDragEnd',
    value: function onDragEnd() {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.node.querySelectorAll('.selected')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var node = _step4.value;

          node.classList.remove('selected');
          node.removeAttribute('draggable');
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
    }
  }]);

  return Source;
}(Player);

var Sink = function (_Player2) {
  _inherits(Sink, _Player2);

  function Sink(nodeOrSelector) {
    _classCallCheck(this, Sink);

    var _this2 = _possibleConstructorReturn(this, (Sink.__proto__ || Object.getPrototypeOf(Sink)).call(this, nodeOrSelector));

    _this2.node.querySelector('article').addEventListener('dragover', _this2.onDragOver.bind(_this2));
    _this2.node.querySelector('article').addEventListener('dragenter', _this2.onDragEnter.bind(_this2));
    // this.node.querySelector('article').addEventListener('dragleave', this.onDragLeave.bind(this));
    _this2.node.querySelector('article').addEventListener('dragend', _this2.onDragEnd.bind(_this2));
    _this2.node.querySelector('article').addEventListener('drop', _this2.onDrop.bind(_this2));
    return _this2;
  }

  _createClass(Sink, [{
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

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.node.querySelectorAll('.over')[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var node = _step5.value;

          node.classList.remove('over');
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      var target = event.target;
      if (typeof target.matches !== 'function') return;
      while (!target.matches('section[data-src]')) {
        console.log(target);
        target = target.parentNode;
        if (!target) return;
        if (typeof target.matches !== 'function') return;
      }

      target.classList.add('over');
    }

    // onDragLeave(event) {}

  }, {
    key: 'onDragEnd',
    value: function onDragEnd(event) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = this.node.querySelectorAll('.over')[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var node = _step6.value;

          node.classList.remove('over');
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    }
  }, {
    key: 'onDrop',
    value: function onDrop(event) {
      event.preventDefault();
      console.log(event.dataTransfer.getData('nodes'));
    }
  }]);

  return Sink;
}(Player);

//# sourceMappingURL=index.js.map