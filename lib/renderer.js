'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (transcript, document, root) {
  var format = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'T';
  var speakers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var digits = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 2;

  var unit = format.startsWith('T') ? 1 : 1000;
  // const article = document.createElement('article');
  // root.appendChild(article);

  transcript.paragraphs.forEach(function (pData) {
    var para = document.createElement('p');
    if (speakers && pData.speaker) {
      var word = document.createElement(format.startsWith('T') ? 'span' : 'a');
      word.appendChild(document.createTextNode(pData.speaker));
      word.setAttribute('class', 'speaker');

      if (format === 'M') {
        word.setAttribute('data-m', parseFloat((pData.start * unit).toFixed(digits)));
      }

      para.appendChild(word);
      para.appendChild(document.createTextNode(' '));
    }

    transcript.words.forEach(function (wData) {
      if (!wData.start) return;
      if (speakers && wData.speaker) return;
      if (wData.start < pData.start || wData.start > pData.end) return;

      var word = document.createElement(format.startsWith('T') ? 'span' : 'a');
      word.appendChild(document.createTextNode(wData.text + ' '));

      var start = parseFloat((wData.start * unit).toFixed(digits));
      var duration = parseFloat((unit * (wData.end - wData.start)).toFixed(digits));

      if (format === 'T') {
        word.setAttribute('data-t', (start + ',' + duration).replace(/^0/, '').replace(/,0/, ','));
      } else if (format === 'M') {
        word.setAttribute('data-m', start);
        if (wData.end) word.setAttribute('data-d', duration);
      }

      para.appendChild(word);
    });

    root.appendChild(para);
  });

  return root;
};