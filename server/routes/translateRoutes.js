const express = require('express');
const router = express.Router();
const { Translate } = require('@google-cloud/translate').v2;

// Initialize Google Translate client
const translate = new Translate(); // Uses GOOGLE_APPLICATION_CREDENTIALS

// POST /api/translate
router.post('/', async (req, res) => {
  const { text, sourceLang = 'en', targetLang = 'si' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const [translation] = await translate.translate(text, {
      from: sourceLang,
      to: targetLang,
    });
    res.json({ translatedText: translation });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// GET /api/translate/languages
router.get('/languages', async (req, res) => {
  try {
    const [languages] = await translate.getLanguages();
    res.json(languages);
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

module.exports = router;