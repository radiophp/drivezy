const mongoose = require('mongoose')
const timestampsPlugin = require('mongoose-timestamp')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')


const BrandSchema = new Schema({
    name : {type: String, required:true, unique:true},
    id  : {type: String, unique:true}
})

BrandSchema.plugin(timestampsPlugin)

module.exports = mongoose.model('Brand' , BrandSchema)