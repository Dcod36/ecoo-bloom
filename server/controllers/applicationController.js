const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Apply for a job (with personal info + ID document upload)
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

        // Check if user has completed profile
        if (!req.user.profileCompleted) {
            return res.status(403).json({ message: 'Please complete your profile before applying.' });
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

        const applications = await Application.find({ job: req.params.jobId }).populate(
            'user',
            'name email rewardPoints profileCompleted phone dateOfBirth address emergencyContact experience idDocumentUrl idDocumentName'
        );
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

        application.status = 'paid';
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admit a volunteer (change status from applied to admitted)
// @route   PUT /api/applications/:id/admit
// @access  Private/Admin
const admitApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' })
        }

        // Verify admin owns the job
        if (application.job.admin.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        application.status = 'admitted';
        await application.save();

        const updatedApp = await Application.findById(req.params.id).populate('user', 'name email rewardPoints profileCompleted phone dateOfBirth address emergencyContact experience idDocumentUrl idDocumentName');
        res.json(updatedApp);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Adjust reward points for a volunteer (add or deduct)
// @route   PATCH /api/applications/:id/points
// @access  Private/Admin
const adjustRewardPoints = async (req, res) => {
    try {
        const { points, reason } = req.body;

        if (typeof points !== 'number' || points === 0) {
            return res.status(400).json({ message: 'Please provide a non-zero numeric points value.' });
        }

        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify admin owns the job
        if (application.job.admin.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Adjust reward points on the volunteer's user account
        const updatedUser = await User.findByIdAndUpdate(
            application.user,
            { $inc: { rewardPoints: points } },
            { new: true }
        ).select('name email rewardPoints');

        res.json({
            message: `${points > 0 ? '+' : ''}${points} points ${points > 0 ? 'awarded to' : 'deducted from'} ${updatedUser.name}`,
            reason: reason || '',
            rewardPoints: updatedUser.rewardPoints,
            userId: updatedUser._id,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { applyForJob, getMyApplications, getJobApplications, markAsPaid, admitApplication, adjustRewardPoints };
