const mongoose = require('mongoose');

const issueReportSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    wasteType: {
        type: String,
        required: true,
        enum: ['plastic', 'organic', 'electronic', 'hazardous', 'metal', 'glass', 'mixed']
    },
    quantity: {
        type: String,
        required: true,
        enum: ['small', 'medium', 'large', 'very_large']
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    verifiedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('IssueReport', issueReportSchema);
