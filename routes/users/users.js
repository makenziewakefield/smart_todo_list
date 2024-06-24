/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userQueries = require('../../db/queries/users');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env')});

//Helpers
const {isItem, categorizeItem, itemIntoDatabase} = require('../../helpers/aiHelpers');

router.get('/', (req, res) => {
  userQueries.getUserItems(1)
    .then(items => {
      const templateVars = {
        userItems: items
      }
      res.render('index', templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });

});

router.get('/:id', (req, res) => {
  userQueries.getUserItems(req.params.id)
    .then(items => {
      const templateVars = {
        userItems: items
      }
      res.render('index', templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });

  // res.render('index');
});

router.post('/:id/delete', (req, res) => {
  // const itemName = req.params.id;
  userQueries.deleteItem(req.params.id)
    .then(() => {
      //send the response to frontend here
      res.status(200).send('done');
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });

});

router.post('/:id/create', async (req, res) => {
  const item = req.body['new-item'];
  const user_id = req.params.id; // Make sure to use user_id consistently
  console.log(`Route hit with user_id: ${user_id}, item: ${item}`);

  try {
    const isRealItem = await isItem(item);
    console.log('Is real item:', isRealItem);
    if (!isRealItem) {
      res.status(400).send({ error: 'This is not an item.' });
      return;
    }
    console.log("*********Calling the categorize function::", categorizeItem(item));
    const category_id = await categorizeItem(item);
    console.log('Category ID:', category_id);
    const insertedItem = await itemIntoDatabase(user_id, item, category_id);
    console.log('Inserted Item:', insertedItem);

    res.status(201).send(insertedItem);
    console.log('///////////// sending response to frontend///////', insertedItem);
    // res.redirect(`/users/${user_id}`); // Uncomment this if you want to redirect after sending the response
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'An error occurred while processing the item.' });
  }
});

router.post('/items/complete-status', (req, res) => {

  console.log('Request body:', req.body);

  const { itemId, isComplete } = req.body;

  console.log('Recieved itemId:', itemId);
  console.log('Recieved isComplete:', isComplete);

  userQueries.itemComplete(itemId, isComplete)
    .then(updatedItem => {
      console.log('Updated item from DB:', updatedItem);
      res.json(updatedItem);
    })
    .catch(err => {
      console.log('Error in DB operation:', err);
      res.status(500).json({ error: err.message });
    });

  });


module.exports = router;
