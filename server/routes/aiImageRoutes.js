const express = require('express');

const aiImageController = require('../controllers/aiImageController');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

router.post('/generate-image', asyncHandler(aiImageController.generateImage));
router.get('/history/:userId', asyncHandler(aiImageController.getHistory));
router.delete('/history/:id', asyncHandler(aiImageController.deleteHistory));

module.exports = router;
