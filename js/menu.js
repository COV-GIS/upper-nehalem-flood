(function (document, anchors, put) {
  'use strict';

  let text;

  let href;

  const menu = document.getElementById('page-menu');

  anchors.add('main.container h4');

  const elements = anchors.elements;

  if (!elements || !menu) return;

  for (let i = 0; i < elements.length; i++) {
    text = elements[i].textContent;
    href = elements[i].querySelector('.anchorjs-link').getAttribute('href');
    elements[i].id = href.replace('#', '');
    put(menu, 'a.list-group-item.list-group-item-action[href=' + href + ']', text);
  }
}(this.document, this.anchors, this.put));
