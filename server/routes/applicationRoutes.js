const express = require('express');
const router = express.Router();
const { applyForJob, getMyApplications, getJobApplications, markAsPaid, admitApplication, adjustRewardPoints } = require('../controllers/applicationController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/:jobId', protect, applyForJob); // User applies (no upload here)
router.get('/my', protect, getMyApplications); // User views their apps
router.get('/job/:jobId', protect, admin, getJobApplications); // Admin views apps for a job
router.patch('/:id/pay', protect, admin, markAsPaid); // Admin marks as paid
router.put('/:id/admit', protect, admin, admitApplication); // Admin admits volunteer
router.patch('/:id/points', protect, admin, adjustRewardPoints); // Admin adjusts reward points

module.exports = router;
