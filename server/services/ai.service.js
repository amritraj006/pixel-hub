import * as aiModel from '../models/ai.model.js';
import createHttpError from '../utils/httpError.js';

export async function generateImage(prompt) {
  if (!prompt || !prompt.trim()) {
    throw createHttpError(400, 'prompt is required');
  }

  return aiModel.generateImage({
    prompt,
    // Pollinations API requires the seed to be <= 2147483647
    seed: Math.floor(Math.random() * 2147483647),
  });
}
