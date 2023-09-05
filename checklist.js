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
router.get('/totals/:id/:userId', function(req, res) {
  const { id, userId } = req.params;
  console.log(req.params);
  const query = `SELECT
    COUNT(bs.date) AS totalSighted,
    (SELECT COUNT(*) FROM testDatabase.checkListData WHERE checklistID = ${mysql.escape(id)}) AS listLength
FROM
    testDatabase.checkListData AS c
LEFT JOIN
    birdSighting AS bs ON bs.birdID = c.species AND bs.userID = ${mysql.escape(userId)}
WHERE
    c.checkListID = ${mysql.escape(id)}`;
  db.query(query, function(err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.get('/:id/:userId', function(req, res) {
  const { id, userId } = req.params;
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
    c.statusHawaiian,
    c.statusExtinct,
    c.statusMisplaced,
    c.statusAccidental,
    IF(bs.birdID IS NOT NULL, bs.date, NULL) as sighted
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
LEFT JOIN
    birdSighting AS bs ON bs.birdID = c.species AND bs.userID = ${mysql.escape(userId)}
WHERE
    checkListID = ${mysql.escape(id)}
GROUP BY
    c.birdRank, bc.englishName, toa.name, f.name, 
    sf.name, g.name, bc.scientificName, c.annotation,
    c.statusNonbreeding, c.statusHawaiian, c.statusExtinct, 
    c.statusMisplaced, c.statusAccidental, sighted`;
  db.query(query, function(err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

module.exports = router;
