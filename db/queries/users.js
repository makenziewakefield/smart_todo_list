const db = require('../connection');

const getUsers = (userId) => {
  return db.query(
    `SELECT * FROM items
     WHERE user_id = $1;`, [userId])
    .then(data => {
      console.log('user items: ', data.rows);
      return data.rows;
    });
};

const getUserItems = (userId) => {
  return db.query(
    `SELECT * FROM items
    WHERE user_id = $1
    ORDER BY id;`, [userId])
    .then(data => {
      console.log('user items: ', data.rows);
      return data.rows;
    });
};

const addNewItem = (userId, title, categoryId) => {
  // const titleBody = title['new-item'];
  console.log('title Extracted: ', title);
  console.log('user id from params: ', userId);
  console.log('category: ', categoryId);

  return db.query(
    `INSERT INTO items (user_id, title, category_id)
    Values ($1, $2, $3)
    RETURNING *`, [userId, title, categoryId])
    .then(data => {
      console.log('user items: ', data.rows);
      return data.rows;
    });
};

const deleteItem = (itemId) => {
  return db.query(
    `DELETE FROM items
    WHERE id = $1;`, [itemId])
    .then(data => {
      console.log('user items: ', data.rows);
      return data.rows;
    });
};

const updateItem = (itemId, categoryId) => {
  return db.query(
    `UPDATE FROM items
    SET category_id = ?
    WHERE item_id = ? `,
    [categoryId, itemId]);


};

const itemComplete = (itemId, status) => {
  return db.query(
    `UPDATE items
    SET is_complete = $1
    WHERE id = $2
    RETURNING *;`, [status, itemId])
    .then(data => {
      console.log(`Updated item with ID ${itemId} to complete status: ${status}`);
      console.log('Updated item: ', data.rows[0]);
      return data.rows[0];
    })
    .catch(err => {
      console.error('Error updating item completion status (queries):', err.message);
    })
};

const updateCategory = (itemId, newCategory) => {
  return db.query(
    `UPDATE items
    SET category_id = $2
    WHERE id = $1
    RETURNING *;
    `, [itemId, newCategory])
    .then(data => {
      console.log('Updated item: ', data.rows);
      return data.rows;
    });
};

const updatedItem = (itemId, categoryId) => {
  return db.query(
    `UPDATE FROM items
    SET category_id = ?
    WHERE item_id = ? `,
    [categoryId, itemId]);


};

module.exports = { getUsers, getUserItems, addNewItem, deleteItem, updateItem, itemComplete, updateCategory };
