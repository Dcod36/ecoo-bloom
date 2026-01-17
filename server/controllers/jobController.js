const Job = require('../models/Job');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = async (req, res) => {
    const { title, description, location, date, startTime, endTime, totalSlots, paymentAmount } = req.body;

    try {
        const job = new Job({
            admin: req.user._id,
            title,
            description,
            location,
            date,
            startTime,
            endTime,
            totalSlots,
            remainingSlots: totalSlots,
            paymentAmount,
        });

        const createdJob = await job.save();
        res.status(201).json(createdJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs (public, usually filtered for open ones but can return all)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'open' }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('admin', 'name email');
        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get jobs created by logged in admin
// @route   GET /api/jobs/myjobs
// @access  Private/Admin
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ admin: req.user._id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update job status (e.g., complete)
// @route   PATCH /api/jobs/:id/complete
// @access  Private/Admin
const completeJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job) {
            if (job.admin.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            job.status = 'completed';
            const updatedJob = await job.save();
            res.json(updatedJob);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job) {
            if (job.admin.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this job' });
            }

            await Job.findByIdAndDelete(req.params.id);
            res.json({ message: 'Job deleted successfully' });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createJob, getJobs, getJobById, getMyJobs, completeJob, deleteJob };
