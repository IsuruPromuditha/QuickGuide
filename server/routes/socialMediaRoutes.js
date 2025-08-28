const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  createSocialGroup,
  getSocialGroups,
  updateSocialGroup,
  deleteSocialGroup,
  getApprovedSocialGroups
} = require('../controllers/socialMediaController');

const { authenticateToken, authorizeGuide } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = path.join(__dirname, '..', 'uploads', 'socialgroups');
    fs.mkdir(dest, { recursive: true }, (err) => cb(err, dest));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'group-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed!'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/social-groups', authenticateToken, authorizeGuide, upload.single('image'), createSocialGroup);
router.get('/social-groups', authenticateToken, authorizeGuide, getSocialGroups);
router.put('/social-groups/:id', authenticateToken, authorizeGuide, upload.single('image'), updateSocialGroup);
router.delete('/social-groups/:id', authenticateToken, authorizeGuide, deleteSocialGroup);

router.get('/approved-social-groups', getApprovedSocialGroups);

module.exports = router;
