const express = require('express');
const router = express.Router();
const { applyForJob, getMyApplications, getJobApplications, markAsPaid, admitApplication } = require('../controllers/applicationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/:jobId', protect, applyForJob); // User applies
router.get('/my', protect, getMyApplications); // User views their apps
router.get('/job/:jobId', protect, admin, getJobApplications); // Admin views apps for a job
router.patch('/:id/pay', protect, admin, markAsPaid); // Admin marks as paid
router.put('/:id/admit', protect, admin, admitApplication); // Admin admits volunteer

module.exports = router;
