const axios = require('axios');

module.exports.insertYearSeason = async function(id, year, season) {
  let data ={
    'year': year,
    'season': season,
  };
  try {
   await axios.put(`https://birdrapi-83d15ff7da21.herokuapp.com/birdSighting/update/${id}`, data)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  } catch (error) {
    console.error(error);
  }
};
