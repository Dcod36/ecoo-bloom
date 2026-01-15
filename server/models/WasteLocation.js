const mongoose = require('mongoose');

const wasteLocationSchema = new mongoose.Schema({
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
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('WasteLocation', wasteLocationSchema);
