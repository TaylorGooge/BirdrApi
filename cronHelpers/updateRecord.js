const { insertRecord } = require('./insertRecord.js');
const axios = require('axios');

module.exports.updateRecord = function(item, pos) {
  const reverseGeocoding = process.env.reverseGeocoding;
  try {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos[0]},${pos[1]}&parameters&key=${reverseGeocoding}`
      )
      .then((response) => {
        let responseData = response.data.results;
        responseData = responseData[0]['address_components'];
        let state = responseData[5]['short_name'];
        let locality = responseData[3]['long_name'];
        let country = responseData[6]['short_name'];
        insertRecord(item, state, locality, country);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
  }
};