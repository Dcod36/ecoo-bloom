const IssueReport = require('../models/IssueReport');
const User = require('../models/User');

// Create a new issue report
const createIssue = async (req, res) => {
    try {
        const { imageUrl, location, latitude, longitude, wasteType, quantity, description } = req.body;

        const issue = await IssueReport.create({
            imageUrl,
            location,
            latitude,
            longitude,
            wasteType,
            quantity,
            description,
            reportedBy: req.user._id
        });

        res.status(201).json(issue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all issues (for admin)
const getAllIssues = async (req, res) => {
    try {
        const issues = await IssueReport.find()
            .populate('reportedBy', 'name email')
            .populate('verifiedBy', 'name')
            .sort({ createdAt: -1 });
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get issues reported by current user
const getMyIssues = async (req, res) => {
    try {
        const issues = await IssueReport.find({ reportedBy: req.user._id })
            .sort({ createdAt: -1 });
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify an issue (admin only) - gives +10 points to reporter
const verifyIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        const { status } = req.body;

        const issue = await IssueReport.findById(issueId);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Only allow verification if currently pending
        if (issue.status !== 'pending') {
            return res.status(400).json({ message: 'Issue has already been processed' });
        }

        issue.status = status;
        issue.verifiedBy = req.user._id;
        issue.verifiedAt = new Date();
        await issue.save();

        // If verified, give +10 reward points to the reporter
        if (status === 'verified') {
            await User.findByIdAndUpdate(issue.reportedBy, {
                $inc: { rewardPoints: 10 }
            });
        }

        const updatedIssue = await IssueReport.findById(issueId)
            .populate('reportedBy', 'name email')
            .populate('verifiedBy', 'name');

        res.json(updatedIssue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's reward points
const getRewardPoints = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('rewardPoints');
        res.json({ rewardPoints: user.rewardPoints || 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createIssue, getAllIssues, getMyIssues, verifyIssue, getRewardPoints };
