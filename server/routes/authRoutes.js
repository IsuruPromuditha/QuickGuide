const express = require('express');
   const router = express.Router();
   const { registerGuide, registerTourist, login, adminLogin } = require('../controllers/authController');

   router.post('/guide', registerGuide);
   router.post('/tourist', registerTourist);
   router.post('/login', login);
   router.post('/admin-login', adminLogin);

   module.exports = router;