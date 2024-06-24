// Web Server Config
const express = require('express');
const router  = express.Router();
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env')});

//Helpers
const {isItem, categorizeItem, itemIntoDatabase} = require('../../helpers/aiHelpers');

  /*user submits item
  Item is checked to see if it is a real item
  if not a real item, send alert/message
  if real item, push the item into categorizeItem
  get items category_id and push into itemIntoDatabase
  */

//post for categorizing items
router.post('/:id', async (req, res) => {
  const item = req.body['new-item'];
  const user_id = req.params.id

  try {
    const isRealItem = await isItem(item);
    if (!isRealItem) {
      res.status(400).send({ error: 'This is not an item.' }); 
      return;
    }

    const category_id = await categorizeItem(item);
    const insertedItem = await itemIntoDatabase(user_id, item, category_id);

    res.status(201).send(insertedItem);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'An error occurred while processing the item.' });
  }
});

module.exports = router;
