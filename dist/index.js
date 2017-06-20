'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
  function Player(rootNodeOrSelector) {
    var collectionSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'article';
    var itemSelector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'section';

    _classCallCheck(this, Player);

    this.collectionSelector = collectionSelector;
    this.itemSelector = itemSelector;
    this.root = typeof rootNodeOrSelector === 'string' ? document.querySelector(rootNodeOrSelector) : rootNodeOrSelector;
  }

  _createClass(Player, [{
    key: 'setup',
    value: function setup(item) {
      console.log('TODO setup player for', item.getAttribute('data-src'));
    }
  }]);

  return Player;
}();

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
}(Player);

var Sink = function (_Player2) {
  _inherits(Sink, _Player2);

  function Sink(rootNodeOrSelector) {
    var collectionSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'article';
    var itemSelector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'section';

    _classCallCheck(this, Sink);

    var _this2 = _possibleConstructorReturn(this, (Sink.__proto__ || Object.getPrototypeOf(Sink)).call(this, rootNodeOrSelector, collectionSelector, itemSelector));

    var collection = _this2.root.querySelector(_this2.collectionSelector);
    collection.addEventListener('dragover', _this2.onDragOver.bind(_this2));
    collection.addEventListener('dragenter', _this2.onDragEnter.bind(_this2));
    // collection.addEventListener('dragleave', this.onDragLeave.bind(this));
    collection.addEventListener('dragend', _this2.onDragEnd.bind(_this2));
    collection.addEventListener('drop', _this2.onDrop.bind(_this2));

    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = collection.querySelectorAll(_this2.itemSelector)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var item = _step5.value;

        _this2.setup(item);
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

    return _this2;
  }

  _createClass(Sink, [{
    key: 'setup',
    value: function setup(item) {
      _get(Sink.prototype.__proto__ || Object.getPrototypeOf(Sink.prototype), 'setup', this).call(this, item);

      item.setAttribute('draggable', true);
      item.setAttribute('tabindex', 0);
      item.addEventListener('dragstart', this.onDragStart.bind(this));
      item.addEventListener('dragend', this.onDragEnd2.bind(this));
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(event) {
      event.dataTransfer.setData('html', event.target.outerHTML);
      event.dataTransfer.effectAllowed = 'copy';
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

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = this.root.querySelectorAll('.over')[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var item = _step6.value;

          item.classList.remove('over');
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

      var target = event.target;
      if (typeof target.matches !== 'function') return;
      while (!target.matches(this.itemSelector + '[draggable]')) {
        // FIXME
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
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = this.root.querySelectorAll('.over')[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var item = _step7.value;

          item.classList.remove('over');
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    }
  }, {
    key: 'onDrop',
    value: function onDrop(event) {
      event.preventDefault();
      var html = event.dataTransfer.getData('html');

      var target = event.target;

      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      var item = wrapper.children[0];

      if (target.nodeName === 'ARTICLE') {
        // FIXME
        target.appendChild(item);
        this.setup(item);
      } else {
        while (!target.matches(this.itemSelector + '[draggable]')) {
          // FIXME
          target = target.parentNode;
        }

        target.parentNode.insertBefore(item, target);
        this.setup(item);
      }

      this.onDragEnd();
    }
  }]);

  return Sink;
}(Player);

var Hyperaudio = function Hyperaudio() {
  var nodeOrSelector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

  _classCallCheck(this, Hyperaudio);

  this.node = typeof nodeOrSelector === 'string' ? document.querySelector(nodeOrSelector) : nodeOrSelector;

  var _iteratorNormalCompletion8 = true;
  var _didIteratorError8 = false;
  var _iteratorError8 = undefined;

  try {
    for (var _iterator8 = this.node.querySelectorAll('.hyperaudio-player')[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
      var player = _step8.value;

      new Player(player);
    }
  } catch (err) {
    _didIteratorError8 = true;
    _iteratorError8 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion8 && _iterator8.return) {
        _iterator8.return();
      }
    } finally {
      if (_didIteratorError8) {
        throw _iteratorError8;
      }
    }
  }
};

// for (const source of this.node.querySelectorAll('.hyperaudio-source')) {
//   new Source(source);
// }
//
// for (const sink of this.node.querySelectorAll('.hyperaudio-sink')) {
//   new Sink(sink);
// }
