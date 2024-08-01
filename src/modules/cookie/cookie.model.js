const mongoose = require('mongoose');

const CookieSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true,
        enum: ['envato'],
    },
    account: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        enum: ['envato'],
    },
    cookie: {
        type: String,
        required: true,
    },
    csrfToken: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive'],
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

export const Cookie = mongoose.models.Cookie || mongoose.model('Cookie', CookieSchema);