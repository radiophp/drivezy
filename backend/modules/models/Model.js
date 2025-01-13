const mongoose = require('mongoose')
const timestampsPlugin = require('mongoose-timestamp')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')


const ModelSchema = new Schema({
    id  : {type: String},
    name : {type: String, required:true},
    brand_id : {type : String},
    brand : {type : Schema.Types.ObjectId, ref:'Brand', required: true},
})

ModelSchema.plugin(timestampsPlugin)

module.exports = mongoose.model('Model' , ModelSchema)