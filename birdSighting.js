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
router.get('/id/:id', function(req, res) {
  const { id } = req.params;
  const query = `SELECT birdCodes.scientificName, birdCodes.englishName, birdCodes.birdImg, birdCodes.birdCall, birdSighting.date, birdSighting.userID, birdSighting.birdID, birdSighting.coordA, 
                birdSighting.coordB, birdSighting.id, birdSighting.userID FROM birdCodes 
                INNER JOIN birdSighting on 
                birdCodes.birdID = birdSighting.birdID 
                WHERE birdSighting.birdID = ${mysql.escape(id)}`;
  console.log(query);
  db.query(query, function(err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});
router.get('/group/:group', function(req, res) {
  const { group } = req.params;
  const query = `SELECT birdCodes.englishName, birdCodes.birdImg, birdCodes.birdCall, birdSighting.date, birdSighting.userID, birdSighting.birdID, birdSighting.coordA, 
                birdSighting.coordB, birdSighting.id, birdSighting.userID FROM birdCodes 
                INNER JOIN birdSighting on 
                birdCodes.birdID = birdSighting.birdID 
                WHERE birdCodes.birdGroup = ${mysql.escape(group)} `;
  db.query(query, function(err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.get('/', function(req, res) {
  const query = `Select * from birdSighting INNER JOIN birdCodes on birdCodes.birdID = birdSighting.birdID ORDER BY birdSighting.date desc`;

  db.query(query, function(err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.post('/geodist', function(req, res) {
  const { long, lat } = req.body;
  const query = `SELECT 
    a.date, a.userID, a.birdID, a.coordA, a.coordB, a.id,
    b.scientificName, b.englishName, b.birdImg, b.birdCall
     FROM birdSighting a 
   INNER JOIN birdCodes b on a.birdID = b.birdID
WHERE (
          acos(sin(a.coordB * 0.0175) * sin(${lat} * 0.0175) 
               + cos(a.coordB * 0.0175) * cos(${lat}* 0.0175) *    
                 cos((${long} * 0.0175) - (a.coordA * 0.0175))
              ) * 6371  <= 10
      )`;
  db.query(query, function(err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});


router.get('/year/:year/season/:season', function(req, res) {
  const { year, season } = req.params;
  const query = `SELECT * FROM birdSighting WHERE year = ${mysql.escape(year)} AND season = ${mysql.escape(season)}`;
  db.query(query, function(err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});


router.get('/user/:user', function(req, res) {
  const { user } = req.params;
  const query = `SELECT birdCodes.englishName, birdCodes.scientificName, birdCodes.birdImg, birdCodes.birdCall, birdSighting.date, birdSighting.userID, birdSighting.birdID, birdSighting.coordA, 
                birdSighting.coordB, birdSighting.id, birdSighting.userID FROM birdCodes 
                INNER JOIN birdSighting on 
                birdCodes.birdID = birdSighting.birdID 
                WHERE birdSighting.userID = ${mysql.escape(user)} ORDER BY birdSighting.date desc`;
  db.query(query, function(err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.get('/date', function(req, res) {
  const { start, end } = req.query;
  const query = `Select * from birdSighting INNER JOIN birdCodes on birdCodes.birdID = birdSighting.birdID WHERE date BETWEEN ${mysql.escape(end)} AND ${mysql.escape(start)}`;
  db.query(query, function(err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});


router.get('/', function(req, res) {
  const query = `Select * from birdSighting INNER JOIN birdCodes on birdCodes.birdID = birdSighting.birdID`;
  db.query(query, function(err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});


//setters
//////////// create new ///////////
router.post('/', function(req, res) {
  const { userID, birdID, coordA, coordB, date, locality, country, state } = req.body;
  const formattedDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  const query = `INSERT INTO birdSighting (userID, birdID, coordA, coordB, date, locality, country, state) VALUES (${mysql.escape(userID)}, ${mysql.escape(birdID)}, ${mysql.escape(coordA)}, ${mysql.escape(coordB)}, ${mysql.escape(formattedDateTime)}, ${mysql.escape(locality)},${mysql.escape(country)},${mysql.escape(state)})`;
  db.query(query, function(err, result) {
    if (err) throw err;
    res.sendStatus(200);
  });
});
//////////// update ///////////
router.put('/update/:id', function(req, res) {
  const { id } = req.params;
  const { userID, birdID, coordA, coordB, date, locality, state, country, year, season } = req.body;

  let query = `UPDATE birdSighting SET `;
  const queryParams = [];

  if (userID) {
    queryParams.push(`userID = ${mysql.escape(userID)}`);
  }
  if (birdID) {
    queryParams.push(`birdID = ${mysql.escape(birdID)}`);
  }
  if (coordA) {
    queryParams.push(`coordA = ${mysql.escape(coordA)}`);
  }
  if (coordB) {
    queryParams.push(`coordB = ${mysql.escape(coordB)}`);
  }
  if (date) {
    queryParams.push(`date = ${mysql.escape(date)}`);
  }
  if (locality) {
    queryParams.push(`locality = ${mysql.escape(locality)}`);
  }
  if (state) {
    queryParams.push(`state = ${mysql.escape(state)}`);
  }
  if (country) {
    queryParams.push(`country = ${mysql.escape(country)}`);
  }
  if (year) {
    queryParams.push(`year = ${mysql.escape(year)}`);
  }
  if (season) {
    queryParams.push(`season = ${mysql.escape(season)}`);
  }

  query += queryParams.join(', ');
  query += ` WHERE id = ${mysql.escape(id)}`;

  db.query(query, function(err, result) {
    if (err) throw err;
    res.sendStatus(200);
  });
});

router.delete('/:id', function(req, res) {
  const { id } = req.params;
  const query = `DELETE FROM birdSighting WHERE id = ${mysql.escape(id)}`;
  db.query(query, function(err, result) {
    if (err) throw err;
    res.sendStatus(200);
  });
});

module.exports = router;
