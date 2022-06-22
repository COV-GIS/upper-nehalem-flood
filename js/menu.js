(function (document, anchors) {
  'use strict';

  // create menus
  const pageMenu = document.getElementById('page-menu');

  function generatePageMenu(els) {
    let text;
    let href;
    for (let i = 0; i < els.length; i++) {
      text = els[i].textContent;
      href = els[i].querySelector('.anchorjs-link').getAttribute('href');
      if (els[i].tagName === 'H3') {
        put(pageMenu, 'a.list-group-item.list-group-item-action[href=' + href + ']', text);
      }
    }
  }

  // add anchors to normal pages
  function addAnchors() {
    anchors.add('.container.content h3');
    if (pageMenu) {
      generatePageMenu(anchors.elements);
    }
  }
  if (anchors) {
    addAnchors();
  } else {
    setTimeout(addAnchors, 100);
  }
}(this.document, this.anchors));
