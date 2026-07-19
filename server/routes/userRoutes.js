const express = require('express');
const router = express.Router();
const { updateProfile, getUserProfile, getUserProfileById } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('idDocument'), updateProfile);
router.get('/:id', protect, admin, getUserProfileById);

module.exports = router;
