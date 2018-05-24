export default (
  transcript,
  document,
  root,
  format = 'T',
  speakers = false,
  digits = 2,
) => {
  const unit = format.startsWith('T') ? 1 : 1000;
  // const article = document.createElement('article');
  // root.appendChild(article);

  transcript.paragraphs.forEach(pData => {
    const para = document.createElement('p');
    if (speakers && pData.speaker) {
      const word = document.createElement(
        format.startsWith('T') ? 'span' : 'a',
      );
      word.appendChild(document.createTextNode(`${pData.speaker} `));
      word.setAttribute('class', 'speaker');

      if (format === 'M') {
        word.setAttribute(
          'data-m',
          parseFloat((pData.start * unit).toFixed(digits)),
        );
      } else if (format === 'T') {
        word.setAttribute(
          'data-t',
          `${parseFloat((pData.start * unit).toFixed(digits))},0`.replace(/^0/, ''),
        );
      }

      para.appendChild(word);
      para.appendChild(document.createTextNode(' '));
    }

    transcript.words.forEach(wData => {
      if (!wData.start) return;
      if (speakers && wData.speaker) return;
      if (wData.start < pData.start || wData.start >= pData.end) return;

      const word = document.createElement(
        format.startsWith('T') ? 'span' : 'a',
      );
      word.appendChild(document.createTextNode(`${wData.text} `));

      const start = parseFloat((wData.start * unit).toFixed(digits));
      const duration = parseFloat(
        (unit * (wData.end - wData.start)).toFixed(digits),
      );

      if (format === 'T') {
        word.setAttribute(
          'data-t',
          `${start},${duration}`.replace(/^0/, '').replace(/,0/, ','),
        );
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
