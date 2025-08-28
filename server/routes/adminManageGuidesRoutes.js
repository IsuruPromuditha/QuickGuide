const express = require('express');
const router = express.Router();

const {
  getGuides,
  getGuideById,
  updateGuideStatus
} = require('../controllers/adminManageGuidesController');

const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

router.use(authenticate, authorizeAdmin);
router.get('/', getGuides);
router.patch('/:id/status', updateGuideStatus);

router.get('/guides/:id', getGuideById);

module.exports = router;