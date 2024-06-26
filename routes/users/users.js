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
  const user_id = req.params.id;
  const forceCategory = req.body.force_category === '4'; // Check if force_category is set to 4
  console.log(`Route hit with user_id: ${user_id}, item: ${item}`);

  try {
    let category_id;

    if (forceCategory) {
      category_id = 4; // Set category_id to 4 if forced
    } else {
      const isRealItem = await isItem(item);
      console.log('Is real item:', isRealItem);
      if (!isRealItem) {
        res.status(400).send({ error: 'This is not an item.' });
        return;
      }
      category_id = await categorizeItem(item);
      console.log('Category ID:', category_id);
    }

    const insertedItem = await itemIntoDatabase(user_id, item, category_id);
    console.log('Inserted Item:', insertedItem);

    res.status(201).send(insertedItem);
    console.log('///////////// sending response to frontend///////', insertedItem);
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

router.post('/:id/update-category', (req, res) => {

  console.log('*****Update item re body body:*****', req.body.category_id);
  const itemId = req.params.id;
  const newCategory = req.body.category_id;

  console.log('Recieved itemId:', itemId);
  console.log('New ID:', newCategory);

  userQueries.updateCategory(itemId, newCategory)
    .then(updatedItem => {
      console.log('Updated RETURNED ITEM', updatedItem);
      res.json(updatedItem);
    })
    .catch(err => {
      console.log('Error in DB operation:', err);
      res.status(500).json({ error: err.message });
    });

});



module.exports = router;
