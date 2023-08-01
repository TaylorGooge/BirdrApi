const axios = require('axios');
const moment = require('moment');

module.exports.insertRecord = async function(item, state, locality, country) {
  let data ={
    'userID': item.userID,
    'birdID': item.birdID,
    'coordA': item.coordA,
    'coordB': item.coordB,
    'date': moment(item.date).format('YYYY-MM-DD'),
    'locality': locality,
    'state': state,
    'country': country
  };
  try {
   await axios.put(`https://birdrapi-83d15ff7da21.herokuapp.com/birdSighting/update/${item.id}`,  data)
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