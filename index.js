const express = require('express');
const router = express.Router(); 

const birdCategories = require('./birdCategories')
const birdCodes = require('./birdCodes')
const birdSighting = require('./birdSighting')
const chartApi = require('./chartApi')
const checklistApi = require('./checklist')


router.use('/birdCategories', birdCategories);
router.use('/birdCodes', birdCodes);
router.use('/birdSighting', birdSighting);
router.use('/data', chartApi);
router.use('/checklists', checklistApi );


module.exports = router;
