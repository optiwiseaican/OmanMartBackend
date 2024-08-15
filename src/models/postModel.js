const mongoose = require('mongoose');

const productDetailsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    productImages: {
        type: [String],
        default: []
    },
    price: {
        type: String,
        required: true
    },
    per: {
        type: String,
        required: true
    },
    minOrderQuantity: {
        type: String,
        required: true
    },
    minOrderPrice: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    timestampMod: {
        type: Date,
        default: Date.now
    },
    postedBy: {
        type: String,
        required: true
    },
    productRating: {
        type: String,
        default: ''
    },
    responseRate: {
        type: String,
        default: ''
    },
    postReviews: {
        type: [String],
        default: []
    },
    verified: {
        type: Boolean,
        default: false
    },
    reviewed: {
        type: Boolean,
        default: false
    },
    tags: {
        type: [String],
        default: []
    },
    category: {
        type: [String],
        default: []
    },
    multiLocations: {
        type: [String],
        default: []
    },
    deliveryTime: {
        type: String,
        default: ''
    },
    currency: {
        type: String,
        default: ''
    },
    acceptEnquiry: {
        type: Boolean,
        default: true
    },
    postType: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    pincode: {
        type: String,
        default: ''
    },
    productVideos: {
        type: [String],
        default: []
    },
    popularity: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    interactions: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const ProductDetails = mongoose.model('Posts', productDetailsSchema);

module.exports = ProductDetails;
