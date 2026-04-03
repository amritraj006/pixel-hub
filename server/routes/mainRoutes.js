const express = require('express');

const aiImageRoutes = require('./aiImageRoutes');
const uploadRoute = require('./uploadRoute');
const likesRoutes = require('./likesRoutes');
const commentRoutes = require('./commentRoutes');

const router = express.Router();

router.use('/api/ai', aiImageRoutes);
router.use('/upload', uploadRoute);
router.use('/api/likes', likesRoutes);
router.use('/api/comments', commentRoutes);

module.exports = router;
