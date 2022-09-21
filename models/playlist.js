const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    name: { type: String },
    tracks: { type: Array },
    created: { type: Number },
    private: { type: Boolean },
    owner: { type: String }
})

const Model = mongoose.model('playlist', Schema)
module.exports = Model