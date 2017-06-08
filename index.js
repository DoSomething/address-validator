const MAPS_API_URI = 'https://maps.googleapis.com/maps/api/';

require('dotenv').config();
const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (! MAPS_API_KEY) {
  console.log('Missing Google Maps API key');
  process.exit();
}

const fs = require('fs');
const fetch = require('node-fetch');
const Baby = require('babyparse');

function getMapData(index, name, address) {
  console.log(`Fetching ${index}...`);

  fetch(`${MAPS_API_URI}place/textsearch/json?query=${address}&key=${MAPS_API_KEY}`)
    .then((res) =>{
      return res.json();
    }).then((res) => {
      if (!res || !res.status || !res.results) {
        console.log('BAD ADDRESS!!!', { index, name });
        return;
      }
    }).catch(err => console.error(err, { index, name }));
}

const contents = fs.readFileSync('./data.csv', 'utf8');
const { data } = Baby.parse(contents);

for (const item of data) {
  const index = item[0];
  const name = item[1];
  const address = `${item[2]} ${item[3]} ${item[4]} ${item[5]}`.replace(/ /g, '+');

  getMapData(index, name, address)
}
