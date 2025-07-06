const express = require('express');
const router = express.Router();
const { registerGuide, registerTourist } = require('../controllers/authController');

router.post('/guide', registerGuide);
router.post('/tourist', registerTourist);

module.exports = router;