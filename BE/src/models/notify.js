const mongoose = require('mongoose')

const notifyModel = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref: 'user'},
    recipients: [mongoose.Types.ObjectId],
    url: {type: String},
    text: {type: String},
    content: {type: String},
    image: {type: String},
    isRead: {type: Boolean, default: false}
}, {
    timestamps: true
})

module.exports = mongoose.model('notify', notifySchema)