const express = require('express');
const router = express.Router();

const uploadRoute = require('./uploadRoute');
const likesRoutes = require('./likesRoutes'); // Optional

router.use('/upload', uploadRoute);
router.use('/api/likes', likesRoutes); // Optional

module.exports = router;
