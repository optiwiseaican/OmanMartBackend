// src/models/requirementModel.js

const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
    requirement_title: {
        type: String,
        required: true,
        trim: true,
    },
    requirement_title_lowercase: {
        type: String,
        required: true,
        trim: true,
    },
    industry_type: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    budget: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    timeline: {
        type: String,
        required: true,
    },
    posted_by: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    timestamp_mod: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: [String],
        default: [],
    },
    multi_locations: {
        type: [String],
        default: [],
    },
    images: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

const Requirement = mongoose.model('Requirement', requirementSchema);

module.exports = Requirement;
