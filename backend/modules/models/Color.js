const mongoose = require('mongoose')
const timestampsPlugin = require('mongoose-timestamp')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')


const ColorSchema = new Schema({
    name : {type: String, required:true, unique:true},
})

ColorSchema.plugin(timestampsPlugin)

module.exports = mongoose.model('Color' , ColorSchema)