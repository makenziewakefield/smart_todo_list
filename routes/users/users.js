/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userQueries = require('../../db/queries/users');

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

// router.post('/:id', (req, res) => {
//   const newTitle = req.body['new-item'];
//   //A function will come here to evaluate the category of the 'new item'
//   //So new item's title will be req.body.new-item
//   //user_id will be req.params.id

//   userQueries.addNewItem(req.params.id, newTitle, 3) //Using hard code categorigy right now
//     .then(newItem => {
//       //send the response to frontend here
//       res.status(200).send(newItem);
//     })
//     .catch(err => {
//       res
//         .status(500)
//         .json({ error: err.message });
//     });

// });

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

router.post('/:id/update', (req, res) => {

})

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env')});

//Helpers
const {isItem, categorizeItem, itemIntoDatabase} = require('../../helpers/aiHelpers');

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
