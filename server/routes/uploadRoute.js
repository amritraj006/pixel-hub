const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db'); // your MySQL connection
const fs = require('fs');

// Set up multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// POST route to handle image upload
router.post('/upload-image', upload.single('image'), (req, res) => {
  const { title, category, description, uploaded_by } = req.body;
  // CHANGE: Store only the filename, not the full path
  const imageUrl = req.file.filename;

  if (!title || !category || !description || !uploaded_by || !req.file) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = 'INSERT INTO images (title, category, description, uploaded_by, image_url, created_at) VALUES (?, ?, ?, ?, ?, NOW())';

  db.query(sql, [title, category, description, uploaded_by, imageUrl], (err, result) => {
    if (err) {
      console.error('DB insert failed:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    console.log('Image uploaded and inserted into DB');
    return res.status(200).json({ message: 'Upload successful', id: result.insertId });
  });
});

// GET /upload/fetch-images
router.get('/fetch-images', (req, res) => {
  const sql = 'SELECT * FROM images ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB fetch error' });
    res.json(results);
  });
});


router.post('/toggle-like', (req, res) => {
  const { imageId, userId } = req.body;

  const checkSql = 'SELECT * FROM image_likes WHERE image_id = ? AND user_id = ?';
  db.query(checkSql, [imageId, userId], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });

    if (result.length > 0) {
      // Already liked — remove like
      const deleteSql = 'DELETE FROM image_likes WHERE image_id = ? AND user_id = ?';
      db.query(deleteSql, [imageId, userId], (err) => {
        if (err) return res.status(500).json({ error: 'DB delete error' });

        const updateSql = 'UPDATE images SET likes = likes - 1 WHERE id = ?';
        db.query(updateSql, [imageId], (err) => {
          if (err) return res.status(500).json({ error: 'DB update error' });
          return res.json({ liked: false });
        });
      });
    } else {
      // Not liked yet — insert like
      const insertSql = 'INSERT INTO image_likes (image_id, user_id) VALUES (?, ?)';
      db.query(insertSql, [imageId, userId], (err) => {
        if (err) return res.status(500).json({ error: 'DB insert error' });

        const updateSql = 'UPDATE images SET likes = likes + 1 WHERE id = ?';
        db.query(updateSql, [imageId], (err) => {
          if (err) return res.status(500).json({ error: 'DB update error' });
          return res.json({ liked: true });
        });
      });
    }
  });
});


// GET posts uploaded by specific user
router.get('/user-posts', (req, res) => {
  const { user_email } = req.query;

  const sql = 'SELECT * FROM images WHERE uploaded_by = ?';
  db.query(sql, [user_email], (err, results) => {
    if (err) {
      console.error('Error fetching user posts:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});







// Delete post
router.delete('/delete-post/:id', (req, res) => {
  const { id } = req.params;
  const { image_url } = req.body;
  const sql = 'DELETE FROM images WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database delete error' });

    // Delete image file from /uploads
    const filePath = path.join(__dirname, '..', 'uploads', image_url);
    fs.unlink(filePath, (fsErr) => {
      if (fsErr) console.warn('File not found or already deleted:', filePath);
    });

    res.json({ message: 'Post and image deleted successfully' });
  });
});

// Edit post
router.put('/edit-post/:id', (req, res) => {
  const { id } = req.params;
  const { title, category, description } = req.body;

  const sql = 'UPDATE images SET title = ?, category = ?, description = ? WHERE id = ?';
  db.query(sql, [title, category, description, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database update error' });
    res.json({ message: 'Post updated successfully' });
  });
});


// GET user stats
router.get('/user-stats', (req, res) => {
  const { user_email } = req.query;

  const statsSql = `
    SELECT 
      COUNT(*) AS totalPosts,
      COALESCE(SUM(likes), 0) AS totalLikes,
      (
        SELECT category 
        FROM images 
        WHERE uploaded_by = ? 
        GROUP BY category 
        ORDER BY COUNT(*) DESC 
        LIMIT 1
      ) AS popularCategory,
      ROUND(COALESCE(SUM(likes), 0) / GREATEST(COUNT(*), 1), 2) AS engagementRate
    FROM images
    WHERE uploaded_by = ?
  `;

  db.query(statsSql, [user_email, user_email], (err, results) => {
    if (err) {
      console.error('Error fetching user stats:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json(results[0] || {
      totalPosts: 0,
      totalLikes: 0,
      popularCategory: '',
      engagementRate: 0
    });
  });
});


// Get latest 4 posts
// Get latest 4 posts
router.get('/latest-posts', (req, res) => {
  const sql = 'SELECT * FROM images ORDER BY created_at DESC LIMIT 4';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching latest posts:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});







module.exports = router;