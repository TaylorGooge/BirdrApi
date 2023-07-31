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
  const query = `SELECT * FROM birdCategories WHERE id = ${mysql.escape(id)}`;
  db.query(query, function (err, result) {
    if (err) throw err; 
    res.status(200).json(result);
  });
});

router.get('/', function (req, res) {
  const query = `SELECT * FROM birdCategories`;
  db.query(query, function (err, result) {
    if (err) throw err;
    //     res.setHeader("Access-Control-Allow-Origin", "https://birdrfrontend.taylorgooge.repl.co")
    // res.setHeader("Access-Control-Allow-Credentials", "true");
    // res.setHeader("Access-Control-Max-Age", "1800");
    // res.setHeader("Access-Control-Allow-Headers", "content-type");
    // res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
    res.status(200).json(result);
  });
});


//setters
//////////// create new ///////////
router.post('/', function (req, res) {
  const { name } = req.body;
  const query = `INSERT INTO birdCategories (name) VALUES ( ${mysql.escape(name)})`;
  db.query(query, function (err, result) {
    if (err) throw err;
    res.sendStatus(200);
  });
});
//////////// update ///////////

router.put('/update/:id', function (req, res) {
  const { id } = req.params;
  const { name } = req.body;
  const query = `UPDATE birdCategories SET name = ${mysql.escape(name)} WHERE id = ${id}`;
  db.query(query, function (err, result) {
    if (err) throw err;
    res.sendStatus(200);
  });
});
module.exports = router;