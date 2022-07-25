(function (document, Cookies, bootstrap) {
  'use strict';

  // alert modal node
  const node = document.getElementById('alert-modal');

  // do nothing if page does not have alert modal
  if (!node) return;

  // flood and actions flags
  let veno3_action = false;
  let veno3_flood = false;
  let rcbo3_action = false;
  let rcbo3_flood = false;

  // notifications
  const action_veno3 = node.querySelector('[data-alert="action_veno3"]');
  const flood_veno3 = node.querySelector('[data-alert="flood_veno3"]');
  const action_rcbo3 = node.querySelector('[data-alert="action_rcbo3"]');
  const flood_rcbo3 = node.querySelector('[data-alert="flood_rcbo3"]');

  // create modal
  const modal = new bootstrap.Modal(node);

  // convienence method to unhide notifications
  const unhide = el => {
    el.removeAttribute('hidden');
    el.removeAttribute('aria-hidden');
  };

  // show modal
  const showModal = () => {
    // do nothing if no flags
    if (!veno3_action && !veno3_flood && !rcbo3_action && !rcbo3_flood) return;

    // unhide appropriate notifications
    if (veno3_action) unhide(action_veno3);
    if (veno3_flood) unhide(flood_veno3);
    if (rcbo3_action) unhide(action_rcbo3);
    if (rcbo3_flood) unhide(flood_rcbo3);

    // show modal
    modal.show();

    // set cookie
    Cookies.set('notified', 'notified', {
      expires: 0.003472, // 5 minutes prodution
      // expires: 0.0014, // 2 minutes for testing
    });
  };

  // get and parse data
  const getData = () => {
    Promise.all([
      fetch(`https://water.weather.gov/ahps2/hydrograph_to_xml.php?gage=veno3&output=xml&time_zone=pdt`),
      fetch(`https://water.weather.gov/ahps2/hydrograph_to_xml.php?gage=rcbo3&output=xml&time_zone=pdt`),
    ])
      .then(async response => {
        // veno3
        await response[0].text().then(data => {
          const { observed, sigstages } = JSON.parse(xml2json(data, { compact: true })).site;

          const current = parseFloat(observed.datum[0].primary._text);

          const action = parseFloat(sigstages.action._text);

          const flood = parseFloat(sigstages.flood._text);

          if (current >= flood) {
            veno3_flood = true;
          } else if (current >= action) {
            veno3_action = true;
          }
        });

        // rcbo3
        await response[1].text().then(data => {
          const { observed, sigstages } = JSON.parse(xml2json(data, { compact: true })).site;

          const current = parseFloat(observed.datum[0].primary._text);

          const action = parseFloat(sigstages.action._text);

          const flood = parseFloat(sigstages.flood._text);

          if (current >= flood) {
            rcbo3_flood = true;
          } else if (current >= action) {
            rcbo3_action = true;
          }
        });

        showModal();
      });
  };

  // check for cookie to initiate get data
  const checkNotified = () => {
    const notified = Cookies.get('notified');

    if (!notified) {
      getData();
    }
  };

  // check again every minute
  setTimeout(() => {
    checkNotified();
  }, 60000);

  // go!
  checkNotified();
}(this.document, this.Cookies, this.bootstrap));
