const createHttpError = require('../utils/httpError');

const POLLINATIONS_BASE_URL = 'https://gen.pollinations.ai/image';

async function generateImage({ prompt, seed }) {
  const apiKey = process.env.POLLINATIONS_API_KEY;

  if (!apiKey) {
    throw createHttpError(
      500,
      'POLLINATIONS_API_KEY is missing in server/.env'
    );
  }

  const encodedPrompt = encodeURIComponent(prompt.trim());
  const modelParam = 'model=flux';
  const requestAttempts = [
    {
      url: `${POLLINATIONS_BASE_URL}/${encodedPrompt}?${modelParam}`,
      headers: {
        Accept: 'image/*',
        Authorization: `Bearer ${apiKey}`,
      },
    },
    {
      url: `${POLLINATIONS_BASE_URL}/${encodedPrompt}?${modelParam}`,
      headers: {
        Accept: 'image/*',
        'x-api-key': apiKey,
      },
    },
    {
      url: `${POLLINATIONS_BASE_URL}/${encodedPrompt}?key=${encodeURIComponent(apiKey)}&${modelParam}`,
      headers: {
        Accept: 'image/*',
      },
    },
    {
      url: `${POLLINATIONS_BASE_URL}/${encodedPrompt}?seed=${seed}&${modelParam}`,
      headers: {
        Accept: 'image/*',
        Authorization: `Bearer ${apiKey}`,
      },
    },
    {
      url: `${POLLINATIONS_BASE_URL}/${encodedPrompt}?seed=${seed}&${modelParam}`,
      headers: {
        Accept: 'image/*',
        'x-api-key': apiKey,
      },
    },
    {
      url: `${POLLINATIONS_BASE_URL}/${encodedPrompt}?seed=${seed}&key=${encodeURIComponent(apiKey)}&${modelParam}`,
      headers: {
        Accept: 'image/*',
      },
    },
  ];

  let lastStatus = 500;
  let lastMessage = 'Pollinations request failed';

  for (const attempt of requestAttempts) {
    const response = await fetch(attempt.url, {
      headers: attempt.headers,
    });

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();

      return {
        buffer: Buffer.from(arrayBuffer),
        contentType: response.headers.get('content-type') || 'image/jpeg',
      };
    }

    lastStatus = response.status;
    const errorText = await response.text().catch(() => '');
    lastMessage = errorText
      ? `Pollinations request failed with status ${response.status}: ${errorText.slice(0, 180)}`
      : `Pollinations request failed with status ${response.status}`;
  }

  throw createHttpError(lastStatus, lastMessage);
}

module.exports = {
  generateImage,
};
