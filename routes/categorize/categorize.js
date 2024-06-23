// Web Server Config
const express = require('express');
const router  = express.Router();

//Helpers
const {categorizeItem, itemIntoDatabase} = require('../../helpers/aiHelpers')

//post for categorizing items
router.post('/', (req, res) => {
  
});

module.exports = router;
