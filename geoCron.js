const axios = require('axios');
const { updateRecord } = require('./cronHelpers/updateRecord.js');
module.exports.geoCron = function() {
  axios.get('https://birdrapi-83d15ff7da21.herokuapp.com/birdSighting')
    .then(response => {
      const data = response.data;
      console.log('response received');
      if(data.length > 0) {
        data.forEach((item) => {
          if (item.state === null && item.locality === null &&  item.country === null){
            updateRecord(item, [item.coordB, item.coordA]);
          }
          else{
            return
          }
        });
      }
    })
    .catch(error => {
      console.error(error);
    });
};