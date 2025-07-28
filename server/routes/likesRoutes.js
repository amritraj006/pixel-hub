const express = require('express');
const router = express.Router();
const db = require('../db');

// Check if liked
router.get('/is-liked', (req, res) => {
  const { user_email, category, title } = req.query;

  const sql = 'SELECT * FROM likes WHERE user_email = ? AND category = ? AND title = ?';
  db.query(sql, [user_email, category, title], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ liked: results.length > 0 });
  });
});

// Add like
router.post('/like', (req, res) => {
  const { user_email, category, title } = req.body;

  const sql = 'INSERT INTO likes (user_email, category, title) VALUES (?, ?, ?)';
  db.query(sql, [user_email, category, title], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// Remove like
router.delete('/unlike', (req, res) => {
  const { user_email, category, title } = req.body;

  const sql = 'DELETE FROM likes WHERE user_email = ? AND category = ? AND title = ?';
  db.query(sql, [user_email, category, title], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// Get liked count for a user


// Get liked count for a user
router.get('/like-count', (req, res) => {
  const { user_email } = req.query;

  const sql = 'SELECT COUNT(*) AS count FROM likes WHERE user_email = ?';
  db.query(sql, [user_email], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ count: results[0].count });
  });
});

// Get all liked images for a user
router.get('/liked-images', (req, res) => {
  const { user_email } = req.query;

  const sql = 'SELECT * FROM likes WHERE user_email = ?';
  db.query(sql, [user_email], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results); // returns array of liked rows with category and title
  });
});



module.exports = router;
