const mongoose = require('mongoose')
const timestampsPlugin = require('mongoose-timestamp')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')


const TempSchema = new Schema({
   latestInvoiceNumber : {type: String}
})

TempSchema.plugin(timestampsPlugin)

module.exports = mongoose.model('Temp' , TempSchema)