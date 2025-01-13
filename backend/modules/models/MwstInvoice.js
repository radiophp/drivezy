const mongoose = require('mongoose')
const timestampsPlugin = require('mongoose-timestamp')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')


const MwstInvoiceSchema = new Schema({
    status : {type: String, default: 'active'},
    customer : {type : Schema.Types.ObjectId, ref:'Customer', required: true},
    car : {type : Schema.Types.ObjectId, ref:'Car', required: true},
    user : {type : Schema.Types.ObjectId, ref:'User', required: true},
    price : {type : Number, required: true}  ,
    invoiceLink : {type: String},
    invoiceNumber : {type: String}

})

MwstInvoiceSchema.plugin(timestampsPlugin)

module.exports = mongoose.model('MwstInvoice' , MwstInvoiceSchema)