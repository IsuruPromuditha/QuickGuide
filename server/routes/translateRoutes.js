const express = require('express');
const router = express.Router();
const { Translate } = require('@google-cloud/translate').v2;

// Initialize Google Translate client
const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY, 
});

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

module.exports = router;