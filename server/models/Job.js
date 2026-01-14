const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: String, // Storing as string or Date depending on logic, keeping simple for now
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    totalSlots: {
        type: Number,
        required: true,
    },
    remainingSlots: {
        type: Number,
        required: true,
    },
    paymentAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'full', 'completed'],
        default: 'open',
    },
}, {
    timestamps: true,
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
