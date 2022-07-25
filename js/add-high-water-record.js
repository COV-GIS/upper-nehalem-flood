import esriConfig from 'https://js.arcgis.com/4.23/@arcgis/core/config.js';
import { whenOnce } from 'https://js.arcgis.com/4.23/@arcgis/core/core/watchUtils.js';
import Map from 'https://js.arcgis.com/4.23/@arcgis/core/Map.js';
import MapView from 'https://js.arcgis.com/4.23/@arcgis/core/views/MapView.js';
import Basemap from 'https://js.arcgis.com/4.23/@arcgis/core/Basemap.js';
import MapImageLayer from 'https://js.arcgis.com/4.23/@arcgis/core/layers/MapImageLayer.js';
import FeatureLayer from 'https://js.arcgis.com/4.23/@arcgis/core/layers/FeatureLayer.js';
import Graphic from 'https://js.arcgis.com/4.23/@arcgis/core/Graphic.js';
import { contains } from 'https://js.arcgis.com/4.23/@arcgis/core/geometry/geometryEngine.js'

import Search from 'https://js.arcgis.com/4.23/@arcgis/core/widgets/Search.js';
import BasemapToggle from 'https://js.arcgis.com/4.23/@arcgis/core/widgets/BasemapToggle.js';

esriConfig.portalUrl = 'https://gis.vernonia-or.gov/portal';

const data = {
  name: '',
  email: '',
  location: '',
  address: '',
  event: '',
  height: '',
  notes: '',
};

const steps = {};

const goToNextStep = nextStep => {
  if (nextStep === 4 && !data.location) {
    alert('Please choose a location in the map.')
    return;
  }

  for (const step in steps) {
    if (parseInt(step) === nextStep) {
      steps[step].removeAttribute('hidden');
    } else {
      steps[step].setAttribute('hidden', '');
    }
  }

  console.log(data);
};


document.querySelectorAll('[data-step]').forEach(form => {
  const step = parseInt(form.getAttribute('data-step'));
  steps[step] = form;

  form.addEventListener('submit', event => {
    event.preventDefault();

    // set any data properties
    for (const i in data) {
      if (form[i]) {
        data[i] = form[i].value;
      }
    }

    // go to next step
    goToNextStep(step + 1);
  });
});

console.log(steps);



















const container = document.getElementById('map');
const input = document.getElementById('location-input');

const load = async () => {

  const base = new MapImageLayer({
    url: 'https://gis.vernonia-or.gov/server/rest/services/UpperNehalemFlood/UNF_Base/MapServer',
  });

  const boundary = new FeatureLayer({
    url: 'https://gis.vernonia-or.gov/server/rest/services/UpperNehalemFlood/UNF_Base/MapServer/15',
  });

  await boundary.load();

  const query = await boundary.queryFeatures({
    where: '1 = 1',
    returnGeometry: true,
    num: 1,
  });

  const boundaryGeometry = query.features[0].geometry;

  const view = new MapView({
    container: container,
    map: new Map({
      basemap: new Basemap({
        portalItem: {
          id: '6e9f78f3a26f48c89575941141fd4ac3',
        },
      }),
      layers: [base],
      ground: 'world-elevation',
    }),
    extent: boundary.fullExtent,
    constraints: {
      rotationEnabled: false,
    },
  });

  const search = new Search({
    view: view,
    locationEnabled: false,
    popupEnabled: false,
    resultGraphicEnabled: false,
  });

  view.ui.add(search, 'top-right');

  whenOnce(search, 'defaultSources.length', () => {
    search.defaultSources.forEach((source) => {
      source.filter = {
        geometry: boundary.fullExtent,
      };
    });
  });

  const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: new Basemap({
      portalItem: {
        id: '2622b9aecacd401583981410e07d5bb9',
      },
    }),
  });

  view.ui.add(basemapToggle, 'bottom-right');

  view.on('click', (event) => {
    view.graphics.removeAll();

    input.value = '';

    const point = event.mapPoint;

    const contained = contains(boundaryGeometry, point);

    if (!contained) {
      return;
    }

    input.value = `${point.longitude.toPrecision(9)},${point.latitude.toPrecision(9)}`;

    view.graphics.add(
      new Graphic({
        geometry: point,
        symbol: {
          type: 'simple-marker',
          style: 'circle',
          color: [0, 0, 255, 0.4],
          size: 12,
          outline: {
            color: 'white',
            width: 1,
          },
        },
      }),
    );
  });
};

load();
