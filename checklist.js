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


router.get('/', function(req, res) {
  const query = 'SELECT * FROM checkList';
  db.query(query, function(err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.get('/:id', function(req, res) {
  const { id } = req.params;
  const query = `SELECT
    c.birdRank,
    bc.englishName,
    toa.name AS orderName,
    f.name AS family,
    sf.name AS subFamily,
    g.name AS genus,
    bc.scientificName,
    c.annotation,
    c.statusNonbreeding,
    c.statusExtinct,
    c.statusMisplaced,
    c.statusAccidental
FROM
    testDatabase.checkListData AS c
JOIN
    birdCodes AS bc ON c.commonName = bc.birdID
JOIN
    taxOrder AS toa ON c.orderName = toa.id
JOIN
    family AS f ON c.family = f.id
LEFT JOIN
    subFamily AS sf ON c.subFamily = sf.id
JOIN
    genus AS g ON c.genus = g.id
JOIN
    birdCodes AS bc_species ON c.species = bc_species.birdID
JOIN
    checkList AS cl ON c.checkListID = cl.id
WHERE
checkListID = ${mysql.escape(id)}`;
  console.log(query)
  db.query(query, function(err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

module.exports = router;
