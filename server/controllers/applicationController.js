const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private/User
const applyForJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.status !== 'open' || job.remainingSlots <= 0) {
            return res.status(400).json({ message: 'Job is full or closed' });
        }

        const alreadyApplied = await Application.findOne({
            job: req.params.jobId,
            user: req.user._id,
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = new Application({
            job: req.params.jobId,
            user: req.user._id,
            status: 'applied',
        });

        await application.save();

        // Decrement slots
        job.remainingSlots = job.remainingSlots - 1;
        if (job.remainingSlots === 0) {
            job.status = 'full';
        }
        await job.save();

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's applications
// @route   GET /api/applications/my
// @access  Private/User
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user._id }).populate('job');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applications for a job (Admin)
// @route   GET /api/applications/job/:jobId
// @access  Private/Admin
const getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.admin.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view these applications' });
        }

        const applications = await Application.find({ job: req.params.jobId }).populate('user', 'name email');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark volunteer as paid
// @route   PATCH /api/applications/:id/pay
// @access  Private/Admin
const markAsPaid = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify admin owns the job
        if (application.job.admin.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        application.status = 'paid'; // or 'Payment Released' as per UI rqt, keeping simple enum for now
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { applyForJob, getMyApplications, getJobApplications, markAsPaid };
