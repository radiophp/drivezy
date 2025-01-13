const mongoose = require('mongoose')
const timestampsPlugin = require('mongoose-timestamp')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')


const CustomerSchema = new Schema({
    name : {type: String},
    family : {type: String},
    company: {type: Boolean},
    companyName : {type: String},
    taxNumber : {type: String},
    nationalCode : {type:String},
    contactInfo : {type:String, required: true},
    email : {type : String },
    country:{type: String,  required: true},
    city:{type: String, required: true },
    address : {type : String, required: true},
    outOfList : {type: Boolean, default : false},
    zipCode: {type: String},
    gender:{type: String, enum:['male', 'female']}

})

CustomerSchema.plugin(timestampsPlugin)

module.exports = mongoose.model('Customer' , CustomerSchema)
