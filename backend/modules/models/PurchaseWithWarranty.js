const mongoose = require('mongoose')
const timestampsPlugin = require('mongoose-timestamp')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')


const PurchaseWithWarrantySchema = new Schema({
    status : {type: String, default: 'active'},
    buyer : {type : Schema.Types.ObjectId, ref:'Customer', required: true},
   // seller : {type : Schema.Types.ObjectId, ref:'Customer', required: true},
    car : {type : Schema.Types.ObjectId, ref:'Car', required: true},
    user : {type : Schema.Types.ObjectId, ref:'User', required: true},
    price : {type : Number, required: true},
    priceDeposit : {type : Number},
    handOverToBuyer :  
        new Schema({
            KFZBrief : {type : Boolean},
            Fahrzeugschein: {type : Boolean},
            Hauptuntersuchung: {type: Boolean},
            Schlüssel : {type: Number},
            description: {type: String}
        }),
    paymentMethod: {type: String, enum:['bar', 'iban', 'diffTax'], required:true},
    paymentMethodDeposit: {type: String, enum:['bar', 'iban']},
    invoiceLink : {type: String},
    stamp : {type: Boolean},
    //get iban field from baseInfo
    //text for diff tax is Differenzbesteuerung nach § 25a
    //paymentMethod is checkbox
        inGermany :{type: Boolean, required: true} // it must be a check box and define the deal is belong to germany or out of that.

})

PurchaseWithWarrantySchema.plugin(timestampsPlugin)

module.exports = mongoose.model('PurchaseWithWarranty' , PurchaseWithWarrantySchema)
