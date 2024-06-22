/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userQueries = require('../../db/queries/users');

router.get('/home', (req, res) => {
  userQueries.getUsers(2)
    .then(users => {
      console.log('users joson response: ', res.json({ users }));
      console.log('//////////RENDERING FROM USERS-API.JS////////');
      res.json({ users });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/home', (req,res) => {
  console.log('///Response Body From Ajax Req///', req.body);
  res.send('Hello there!');
});

module.exports = router;



