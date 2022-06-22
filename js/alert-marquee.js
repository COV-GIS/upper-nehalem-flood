let veno3 = false;
let rcbo3 = false;

const createMarquee = () => {
  if (veno3 && rcbo3) {
    $('.alert-marquee').marquee({
      allowCss3Support: true,
      pauseOnHover: true,
      speed: 75
    });
  }
};

fetch(`https://water.weather.gov/ahps2/hydrograph_to_xml.php?gage=veno3&output=xml&time_zone=pdt`)
  .then(response => response.text())
  .then(data => {
    // parse gage data
    const { observed, sigstages } = JSON.parse(xml2json(data, { compact: true })).site;

    const marquee = document.querySelector('div.marquee-container');

    const div = document.querySelector('div.alert-marquee');

    const text = document.createElement('span');

    const current = parseFloat(observed.datum[0].primary._text);

    const action = parseFloat(sigstages.action._text);

    const flood = parseFloat(sigstages.flood._text);

    if (current >= flood) {
      text.innerHTML = 'Nehalem River at Clear Creek is at or above flood stage.';
      div.append(text);
      marquee.removeAttribute('hidden');
    } else if (current >= action) {
      text.innerHTML = 'Nehalem River at Clear Creek is at action stage.';
      div.append(text);
      marquee.removeAttribute('hidden');
    }

    veno3 = true;

    createMarquee();
  });

fetch(`https://water.weather.gov/ahps2/hydrograph_to_xml.php?gage=rcbo3&output=xml&time_zone=pdt`)
  .then(response => response.text())
  .then(data => {
    // parse gage data
    const { observed, sigstages } = JSON.parse(xml2json(data, { compact: true })).site;

    const marquee = document.querySelector('div.marquee-container');

    const div = document.querySelector('div.alert-marquee');

    const text = document.createElement('span');

    const current = parseFloat(observed.datum[0].primary._text);

    const action = parseFloat(sigstages.action._text);

    const flood = parseFloat(sigstages.flood._text);

    if (current >= flood) {
      text.innerHTML = 'Rock Creek at Vernonia is at or above flood stage.';
      div.append(text);
      marquee.removeAttribute('hidden');
    } else if (current >= action) {
      text.innerHTML = 'Rock Creek at Vernonia is at action stage.';
      div.append(text);
      marquee.removeAttribute('hidden');
    }

    rcbo3 = true;

    createMarquee();
  });
