const DateTime = luxon.DateTime;

const gageInfo = (gage) => {
  // fetch data
  fetch(`https://water.weather.gov/ahps2/hydrograph_to_xml.php?gage=${gage.toLowerCase()}&output=xml&time_zone=pdt`)
    .then(response => response.text())
    .then(data => {
      // parse gage data
      const { observed, sigstages } = JSON.parse(xml2json(data, { compact: true })).site;
      // current stage
      document.querySelector(`span[data-gage-stage="${gage}"]`)
        .innerHTML = observed.datum[0].primary._text;
      // current timestamp
      document.querySelector(`span[data-gage-timestamp="${gage}"]`)
        .innerHTML = DateTime.fromISO(observed.datum[0].valid._text).toLocaleString(DateTime.DATETIME_FULL);
      // action stage
      document.querySelector(`span[data-gage-action="${gage}"]`)
        .innerHTML = sigstages.action._text;
      // flood stage
      document.querySelector(`span[data-gage-flood="${gage}"]`)
        .innerHTML = sigstages.flood._text;
      // hide loading
      document.querySelector(`div[data-gage-loading="${gage}"]`).setAttribute('hidden', '');
      // show info
      document.querySelector(`p[data-gage-info="${gage}"]`).removeAttribute('hidden');
    });
};

// clear creek
gageInfo('VENO3');

// rock creek
gageInfo('RCBO3');

// foss
gageInfo('FSSO3');

// refresh button
document.querySelector('button[data-gage-refresh]')
  .addEventListener('click', () => {
    gageInfo('VENO3');
    gageInfo('RCBO3');
    gageInfo('FSSO3');
  });

// auto refresh
setInterval(() => {
  gageInfo('VENO3');
  gageInfo('RCBO3');
  gageInfo('FSSO3');
}, 300000);
