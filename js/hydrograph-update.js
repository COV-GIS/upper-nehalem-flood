/**
 * Update hydrograph images.
 */
(function (document) {
  'use strict';

  const veno3 = document.querySelector('[data-hydrograph-image="veno3"]');
  const rcbo3 = document.querySelector('[data-hydrograph-image="rcbo3"]');

  setInterval(() => {
    if (veno3) veno3.setAttribute('src', 'https://water.weather.gov/resources/hydrographs/veno3_hg.png');
    if (rcbo3) rcbo3.setAttribute('src', 'https://water.weather.gov/resources/hydrographs/rcbo3_hg.png');
  }, 300000);

}(this.document));
