const express = require('express');
const router = express.Router();
const { createIssue, getAllIssues, getMyIssues, verifyIssue, getRewardPoints } = require('../controllers/issueController');
const { protect, admin } = require('../middleware/authMiddleware');

// User routes
router.post('/', protect, createIssue);
router.get('/my', protect, getMyIssues);
router.get('/rewards', protect, getRewardPoints);

// Admin routes
router.get('/all', protect, admin, getAllIssues);
router.put('/verify/:issueId', protect, admin, verifyIssue);

module.exports = router;
