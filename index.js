const express = require('express');
const router = express.Router(); 

const birdCategories = require('./birdCategories')
const birdCodes = require('./birdCodes')
const birdSighting = require('./birdSighting')


router.use('/birdCategories', birdCategories);
router.use('/birdCodes', birdCodes);
router.use('/birdSighting', birdSighting);


module.exports = router;