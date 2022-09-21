const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    idG: { type: String },
    status: { type: Boolean },
    channel: { type: String },
    playMsg: { type: String },
    queueMsg: { type: String }
})

const Model = mongoose.model('setup', Schema)
module.exports = Model