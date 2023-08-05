const axios = require('axios');
const dateResolver = require('date-season')
const { insertYearSeason } = require('./cronHelpers/insertYearSeason.js');

module.exports.seasonCron = function () {
  axios.get('https://birdrapi-83d15ff7da21.herokuapp.com/birdSighting')
    .then(response => {
      const data = response.data;
      if (data.length > 0) {
        data.forEach((item) => {
          if (item.year === null && item.season === null) {
            const date = item.date.slice(0, 10);
            const NorthernHemisphere = dateResolver();
            const season = NorthernHemisphere(date);
            const year = new Date(date).getFullYear();
            insertYearSeason(item.id, year, season);
          }
        });
      }
    })
    .catch(error => {
      console.error(error);
    });
};
