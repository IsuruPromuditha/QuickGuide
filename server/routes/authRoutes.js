const express = require('express');
   const router = express.Router();
   const { registerGuide, registerTourist, login } = require('../controllers/authController');

   router.post('/guide', registerGuide);
   router.post('/tourist', registerTourist);
   router.post('/login', login);

   module.exports = router;