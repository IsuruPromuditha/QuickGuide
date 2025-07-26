const express = require('express');
const router = express.Router();
const { getGuide, updateGuide, addPost, getPosts, addGalleryImage, getGalleryImages, deletePost, deleteGalleryImage, getAllGuides, getGuideProfile, getGuidePosts, updatePost } = require('../controllers/guideController');
const { authenticateToken, authorizeGuide } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.path.includes('/post')) {
      cb(null, 'Uploads/posts/');
    } else if (req.path.includes('/gallery')) {
      cb(null, 'Uploads/posts/');
    } else if (req.path.includes('/guide') && file.fieldname === 'profileImage') {
      cb(null, 'Uploads/profiles/');
    } else {
      cb(null, 'uploads/');
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/guide/:id', authenticateToken, authorizeGuide, getGuide);
router.put('/guide/:id', authenticateToken, authorizeGuide, upload.single('profileImage'), updateGuide);
router.post('/guide/:id/post', authenticateToken, authorizeGuide, upload.array('images', 10), addPost);  
router.put('/post/:postId', authenticateToken, authorizeGuide, upload.array('images', 10), updatePost);
router.get('/guide/:id/posts', authenticateToken, authorizeGuide, getPosts);
router.post('/guide/:id/gallery', authenticateToken, authorizeGuide, upload.single('image'), addGalleryImage);
router.get('/guide/:id/gallery', authenticateToken, authorizeGuide, getGalleryImages);
router.delete('/post/:postId', authenticateToken, authorizeGuide, deletePost);
router.delete('/gallery/:imageId', authenticateToken, authorizeGuide, deleteGalleryImage);
router.get('/guides', getAllGuides);
router.get('/profile/:id', getGuideProfile);
router.get('/profile/:id/posts', getGuidePosts);

module.exports = router;