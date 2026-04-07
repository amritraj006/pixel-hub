import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as aiImageService from '../services/ai.service.js';
import * as historyModel from '../models/history.model.js';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateImage(req, res) {
  const { prompt, userId } = req.body;
  const result = await aiImageService.generateImage(prompt);

  if (userId) {
    const base64Str = result.buffer.toString('base64');
    const dataURI = `data:${result.contentType};base64,${base64Str}`;

    try {
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'pixel-hub-ai-generations',
      });
      
      const imageUrl = uploadResult.secure_url;
      const record = await historyModel.saveHistory(userId, prompt, imageUrl);
      
      res.json({
        success: true,
        data: record,
        imageUrl: imageUrl
      });
    } catch (error) {
      console.error('Error uploading AI image to Cloudinary:', error);
      res.status(500).json({ error: 'Failed to upload generated image' });
    }
  } else {
    // Fallback if no userId provided (though technically we should block this or treat as guest)
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.send(result.buffer);
  }
}

export async function getHistory(req, res) {
  const { userId } = req.params;
  const history = await historyModel.fetchHistory(userId);
  res.json(history);
}

export async function deleteHistory(req, res) {
  const { id } = req.params;
  const { userId } = req.body;
  const record = await historyModel.deleteHistory(id, userId);
  
  if (record && record.image_url) {
    if (record.image_url.includes('cloudinary.com')) {
      try {
        const urlParts = record.image_url.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `pixel-hub-ai-generations/${filename.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.warn('Unable to delete AI image from Cloudinary:', record.image_url, error.message);
      }
    } else {
      const filePath = path.join(__dirname, '..', 'uploads', record.image_url);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn('Unable to delete local AI image:', err.message);
        }
      }
    }
  }
  res.json({ success: true, message: 'Deleted successfully' });
}
