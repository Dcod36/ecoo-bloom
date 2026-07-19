const User = require('../models/User');
const Application = require('../models/Application');
const WasteLocation = require('../models/WasteLocation');

// @desc    Update user profile (personal info & ID upload)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.phone = req.body.phone || user.phone;
            user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
            user.address = req.body.address || user.address;
            user.emergencyContact = req.body.emergencyContact || user.emergencyContact;
            user.experience = req.body.experience || user.experience;
            
            if (req.file) {
                user.idDocumentUrl = `http://localhost:5000/uploads/${req.file.filename}`;
                user.idDocumentName = req.file.originalname;
            }

            user.profileCompleted = true;

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile by ID (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserProfileById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch user's applications
        const applications = await Application.find({ user: user._id }).populate('job', 'title location date paymentAmount');

        // Fetch user's reported issues
        const issues = await WasteLocation.find({ createdBy: user._id });

        res.json({
            user,
            applications,
            issues
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateProfile, getUserProfile, getUserProfileById };
