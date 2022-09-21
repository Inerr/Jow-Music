const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    idG: { type: String },
    lang: { type: String, default: 'en' }
})

const Model = mongoose.model('lang', Schema)
module.exports = Model