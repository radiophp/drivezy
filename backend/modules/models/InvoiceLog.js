const mongoose = require('mongoose')
const timestampsPlugin = require('mongoose-timestamp')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')


const InvoiceLogSchema = new Schema({
    car : {type : Schema.Types.ObjectId, ref:'Car'},
    invoiceType : {type: String},
    invoiceId : {type: Schema.Types.ObjectId}
})

InvoiceLogSchema.plugin(timestampsPlugin)

module.exports = mongoose.model('InvoiceLog' , InvoiceLogSchema)