const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, getMyJobs, completeJob, deleteJob } = require('../controllers/jobController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getJobs)
    .post(protect, admin, createJob);

router.get('/myjobs', protect, admin, getMyJobs);

router.route('/:id')
    .get(getJobById)
    .delete(protect, admin, deleteJob);

router.patch('/:id/complete', protect, admin, completeJob);

module.exports = router;
