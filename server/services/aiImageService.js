const aiImageModel = require('../models/aiImageModel');
const createHttpError = require('../utils/httpError');

async function generateImage(prompt) {
  if (!prompt || !prompt.trim()) {
    throw createHttpError(400, 'prompt is required');
  }

  return aiImageModel.generateImage({
    prompt,
    // Pollinations API requires the seed to be <= 2147483647
    seed: Math.floor(Math.random() * 2147483647),
  });
}

module.exports = {
  generateImage,
};
