const { Schema, model } = require("mongoose");

const notificationSchema = new Schema({
    serviceName : {
        type: String,
        enum : ['Envato', 'Freepik', 'Storyblocks', 'MotionArray'],
        required: true,
    },
    content : {
        type: String,
        required: true,
        default: ''
    }
})

export const Notification = model('Notification', notificationSchema);