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
router.get('/:id', function (req, res) {
  const { id } = req.params;
  const query = `SELECT * FROM birdCodes WHERE birdID = ${mysql.escape(id)}`;
  db.query(query, function (err, result) {
    if (err) throw err; 
    res.status(200).json(result);
  });
});

router.get('/', function (req, res) {
  const query = `SELECT * FROM birdCodes`;
  db.query(query, function (err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});


//setters
//////////// create new ///////////
router.post('/', function (req, res) {
  const { fourCode, sixCode, englishName, scientificName, birdGroup, birdImg, birdCall } = req.body;
  const query = `INSERT INTO birdCodes (fourCode, sixCode, englishName, scientificName, birdGroup, birdImg, birdCall) VALUES (${mysql.escape(fourCode)}, ${mysql.escape(sixCode)}, ${mysql.escape(englishName)}, ${mysql.escape(scientificName)}, ${mysql.escape(birdGroup)}, ${mysql.escape(birdImg)}, ${mysql.escape(birdCall)})`;
  db.query(query, function (err, result) {
    if (err) throw err;
    res.sendStatus(200);
  });
});
//////////// update ///////////
router.put('/update/:id', function (req, res) {
  const { id } = req.params;
  const { fourCode, sixCode, englishName, scientificName, birdGroup, birdImg, birdCall } = req.body;
  const query = `
    UPDATE birdCodes 
    SET fourCode = ${mysql.escape(fourCode)}, 
      sixCode = ${mysql.escape(sixCode)}, 
      englishName = ${mysql.escape(englishName)},
      scientificName = ${mysql.escape(scientificName)},
      birdGroup = ${mysql.escape(birdGroup)},
      birdImg = ${mysql.escape(birdImg)},
      birdCall = ${mysql.escape(birdCall)}
    WHERE birdID = ${mysql.escape(id)}`;
  db.query(query, function (err, result) {
    if (err) throw err;
    res.sendStatus(200);
  });
});

module.exports = router;