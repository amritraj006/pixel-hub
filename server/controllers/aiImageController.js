const aiImageService = require('../services/aiImageService');
const historyModel = require('../models/historyModel');
const fs = require('fs');
const path = require('path');

async function generateImage(req, res) {
  const { prompt, userId } = req.body;
  const result = await aiImageService.generateImage(prompt);

  if (userId) {
    const filename = `ai-gen-${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const filePath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filePath, result.buffer);
    
    const record = await historyModel.saveHistory(userId, prompt, filename);
    
    res.json({
      success: true,
      data: record,
      imageUrl: `http://localhost:8000/uploads/${filename}`
    });
  } else {
    // Fallback if no userId provided (though technically we should block this or treat as guest)
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.send(result.buffer);
  }
}

async function getHistory(req, res) {
  const { userId } = req.params;
  const history = await historyModel.fetchHistory(userId);
  res.json(history);
}

async function deleteHistory(req, res) {
  const { id } = req.params;
  const { userId } = req.body;
  const record = await historyModel.deleteHistory(id, userId);
  
  if (record && record.image_url) {
    const filePath = path.join(__dirname, '..', 'uploads', record.image_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  res.json({ success: true, message: 'Deleted successfully' });
}

module.exports = {
  generateImage,
  getHistory,
  deleteHistory,
};
