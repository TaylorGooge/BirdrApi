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
router.get('/id/:id', function (req, res) {
  const { id } = req.params;
  const query = `SELECT birdCodes.englishName, birdCodes.birdImg, birdCodes.birdCall, birdSighting.date, birdSighting.userID, birdSighting.birdID, birdSighting.coordA, 
                birdSighting.coordB, birdSighting.id, birdSighting.userID FROM birdCodes 
                INNER JOIN birdSighting on 
                birdCodes.birdID = birdSighting.birdID 
                WHERE birdSighting.birdID = ${mysql.escape(id)}`;
  db.query(query, function (err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});
router.get('/group/:group', function (req, res) {
  const { group } = req.params;
  const query = `SELECT birdCodes.englishName, birdCodes.birdImg, birdCodes.birdCall, birdSighting.date, birdSighting.userID, birdSighting.birdID, birdSighting.coordA, 
                birdSighting.coordB, birdSighting.id, birdSighting.userID FROM birdCodes 
                INNER JOIN birdSighting on 
                birdCodes.birdID = birdSighting.birdID 
                WHERE birdCodes.birdGroup = ${mysql.escape(group)} `;
  db.query(query, function (err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.get('/', function (req, res) {
  const query = `Select * from birdSighting INNER JOIN birdCodes on birdCodes.birdID = birdSighting.birdID`;
  db.query(query, function (err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.get('/user/:user', function (req, res) {
  const { user } = req.params;
  const query = `SELECT birdCodes.englishName, birdCodes.scientificName, birdCodes.birdImg, birdCodes.birdCall, birdSighting.date, birdSighting.userID, birdSighting.birdID, birdSighting.coordA, 
                birdSighting.coordB, birdSighting.id, birdSighting.userID FROM birdCodes 
                INNER JOIN birdSighting on 
                birdCodes.birdID = birdSighting.birdID 
                WHERE birdSighting.userID = ${mysql.escape(user)} `;
  db.query(query, function (err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

 router.get('/date', function(req, res) {
  const { start, end } = req.body;
  const query = `Select * from birdSighting INNER JOIN birdCodes on birdCodes.birdID = birdSighting.birdID WHERE date <= ${mysql.escape(end)} and date >= ${mysql.escape(start)}`;
  db.query(query, function (err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.get('/', function (req, res) {
  const query = `Select * from birdSighting INNER JOIN birdCodes on birdCodes.birdID = birdSighting.birdID`;
  db.query(query, function (err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});


//setters
//////////// create new ///////////
router.post('/', function (req, res) {
  const { userID, birdID, coordA, coordB, date, locality, country, state } = req.body;
   const formattedDateTime = moment(date).format('YYYY-MM-DD HH:mm:ss');
  console.log(req.body);
  const query = `INSERT INTO birdSighting (userID, birdID, coordA, coordB, date, locality, country, state) VALUES (${mysql.escape(userID)}, ${mysql.escape(birdID)}, ${mysql.escape(coordA)}, ${mysql.escape(coordB)}, ${mysql.escape(formattedDateTime)}, ${mysql.escape(locality)},${mysql.escape(country)},${mysql.escape(state)})`;
  db.query(query, function (err, result) {
    if (err) throw err;
    res.sendStatus(200);
  });
});
//////////// update ///////////
router.put('/update/:id', function (req, res) {
  const { id } = req.params;
  const { userID, birdID, coordA, coordB, date , locality, state, country} = req.body;
  console.log(req.body)
 
 let query = `
    UPDATE birdSighting 
    SET userID = ${mysql.escape(userID)}, 
    birdID = ${mysql.escape(birdID)}, 
    coordA = ${mysql.escape(coordA)},
    coordB = ${mysql.escape(coordB)},
    date = ${mysql.escape(date)}`
  if (locality) {
    query += `, locality = ${mysql.escape(locality)}`;
  }
  if (state) {
    query += `, state = ${mysql.escape(state)}`;
  }
  if (locality) {
    query += `, country = ${mysql.escape(country)}`;
  }
  query += ` WHERE id = ${mysql.escape(id)}`;
    
  db.query(query, function (err, result) {
    if (err) throw err;
    res.sendStatus(200);
  });
});

router.delete('/:id', function(req, res) {
  const { id } = req.params;
  const query = `DELETE FROM birdSighting WHERE id = ${mysql.escape(id)}`;
  db.query(query, function (err, result) {
    if (err) throw err;
    res.sendStatus(200);
  });
});

module.exports = router;
