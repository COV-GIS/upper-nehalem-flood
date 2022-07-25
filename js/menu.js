(function (document, put, bootstrap) {
  'use strict';

  const menu = document.getElementById('page-menu');

  document.querySelectorAll('main.container h2')
    .forEach(ele => {
      const text = ele.textContent;

      const id = text.toLowerCase().replace(' ', '-');

      ele.setAttribute('id', id);

      const anchor = put(menu, `a.list-group-item.list-group-item-action[href=#${id}]`, text);

      // this overrides bs scroll spy behavior to not set url hash
      // and correctly scrolls to the the proper element
      anchor.addEventListener('click', event => {
        event.preventDefault();

        document.getElementById(id).scrollIntoView(true);
      });
    });

  new bootstrap.ScrollSpy(document.body, {
    target: menu,
  });
}(this.document, this.put, this.bootstrap));
