const express = require('express');
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config();
const moment = require('moment');
const axios = require('axios');

// ///api//////
const db = mysql.createPool({
  user: process.env.user,
  password: process.env.password,
  host: process.env.host,
  port: process.env.dbport,
  database: process.env.database,
});

//getters
router.get('/top10species', function(req, res, next) {
  const query = `SELECT
            COUNT(*) as 'Count',
            birdCodes.englishName,
            birdCodes.scientificName,
            birdCodes.fourCode,
            birdCodes.sixCode
            FROM birdSighting
            INNER JOIN birdCodes ON birdSighting.birdID = birdCodes.birdID
            GROUP BY birdSighting.birdID
            ORDER BY COUNT(*) DESC
            LIMIT 10;`
  db.query(query, function(err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });

});

router.get('/top10group', function(req, res, next) {
  const query=`SELECT
        COUNT(*) as 'Count',
        birdCategories.name
        FROM birdSighting
        INNER JOIN birdCodes ON birdSighting.birdID = birdCodes.birdID
        INNER JOIN birdCategories on birdCodes.birdGroup = birdCategories.id
        GROUP BY birdSighting.birdID
        ORDER BY COUNT(*) DESC
        LIMIT 10;`
  db.query(query, function(err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
    
});

router.get('/birdrlocations', function(req, res, next) {
  db.query('SELECT DISTINCT coordA, coordB, locality, state from birdSighting', function(error, results) {
    if (error) {
      res.status(401).json({ error: 'Couldn\'t complete request' });
    } else {
      const obj = [['Lat', 'Lng', 'City']];
      for (let i = 0; i < results.length; i++) {
        const temp = [parseFloat(results[i].coordB), parseFloat(results[i].coordA), results[i].locality];
        obj.push(temp);
      }
      res.send(obj);
    }
  });
});

module.exports = router;
