const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema(
  {
    requirementTitle: {
      type: String,
      required: true,
      trim: true,
    },
    industryType: {
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
    postedBy: {
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
    timestampMod: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: [String],
      default: [],
    },
    multiLocations: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

requirementSchema.index({ requirementTitle: 'text' });

const Requirement = mongoose.model('Requirement', requirementSchema);

module.exports = Requirement;
