const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
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


router.get('/', async function(req, res) {
  try {
    const query = 'SELECT * FROM checkList';
    const [rows] = await db.execute(query); // Use await to execute the query
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/totals/:id/:userId', async function(req, res) {
  const { id, userId } = req.params;

  try {
    const query = `SELECT
      COUNT(bs.date) AS totalSighted,
      (SELECT COUNT(*) FROM checkListData WHERE checklistID = ?) AS listLength
    FROM
      checkListData AS c
    LEFT JOIN
      birdSighting AS bs ON bs.birdID = c.species AND bs.userID = ? 
    WHERE
      c.checkListID = ?`;

    const [rows] = await db.execute(query, [id, userId, id]); // Use await and pass parameters
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/:id/:userId', async function(req, res) {
  const { id, userId } = req.params;

  // Retrieve the required columns from checklistColumnMapping based on checkListID
  try {
    const [rows] = await db.execute(
      'SELECT GROUP_CONCAT(column1) AS columns ' +
      'FROM checklistColumnMapping ' +
      'WHERE checkListID = ?',
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Checklist not found' });
      return;
    }

    const columns = rows[0].columns.split(',');

    // Dynamic query to select specific columns from checkListData
    let query = `
      SELECT ${columns.map(column => {
      switch (column) {
        case 'birdRank':
          return 'c.birdRank';
        case 'commonName':
          return 'bc.englishName';
        case 'orderName':
          return 'toa.name AS orderName';
        case 'family':
          return 'f.name AS family';
        case 'subFamily':
          return 'sf.name AS subFamily';
        case 'genus':
          return 'g.name AS genus';
        case 'species':
          return 'bc.scientificName';
        case 'annotation':
          return 'c.annotation';
        case 'statusNonbreeding':
          return 'c.statusNonbreeding';
        case 'statusExtinct':
          return 'c.statusExtinct';
        case 'statusMisplaced':
          return 'c.statusMisplaced';
        case 'statusAccidental':
          return 'c.statusAccidental';
        default:
          return column;
      }
    }).filter(mapping => mapping !== '').join(', ')}, 
      IF(bs.birdID IS NOT NULL, bs.date, NULL) as sighted
      FROM checkListData AS c
      JOIN birdCodes AS bc ON c.commonName = bc.birdID
      JOIN family AS f ON c.family = f.id
      LEFT JOIN subFamily AS sf ON c.subFamily = sf.id
      JOIN birdCodes AS bc_species ON c.species = bc_species.birdID
      JOIN checkList AS cl ON c.checkListID = cl.id
      LEFT JOIN birdSighting AS bs ON bs.birdID = c.species AND bs.userID = ${mysql.escape(userId)}`;

    if (columns.includes('orderName')) {
      query += ' JOIN taxOrder AS toa ON c.orderName = toa.id ';
    }

    if (columns.includes('genus')) {
      query += ' JOIN genus AS g ON c.genus = g.id ';
    }

   query += `WHERE checkListID = ${mysql.escape(id)} GROUP BY ${columns.join(', ')}, sighted`;

    const [results] = await db.execute(query, [userId, id]);
    const responseData = {
      rows: columns,
      results,
    };
    res.status(200).json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
