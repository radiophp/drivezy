const mongoose = require('mongoose')
const timestampsPlugin = require('mongoose-timestamp')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')


const ComissionAgreementSchema = new Schema({
    status : {type: String, default: 'active'},
    buyer : {type : Schema.Types.ObjectId, ref:'Customer', required: true},
    seller : {type : Schema.Types.ObjectId, ref:'Customer', required: true},
    car : {type : Schema.Types.ObjectId, ref:'Car', required: true},
    user : {type : Schema.Types.ObjectId, ref:'User', required: true},
    price : {type : Number, required: true},
    priceDeposit : {type : Number},
    paymentMethodDeposit: {type: String, enum:['bar', 'iban']},
    buyWithNoWarrantyGuaranty: {type: Boolean}, //please add a checkbox for this field by this text."Gekauft wie gesehen, unter Ausschluss jeglicher Gewährleistung und Garantie"
    noReturn: {type: Boolean}, //please add a checkbox for this field by this text."Im Kundenauftrag, keine Gewährleistung und Garantie sowie Rücknahme"
    salesTakePlace: {type: Boolean}, //please add a checkbox for this field by this text."Verkauf erfolgt nach Export, unter Ausschluss jeglicher Gewährleistung und Garantie"
    differentTax: {type: Boolean}, //please add a checkbox for this field by this text."Differenzbesteuerung nach § 25a"   
    handOverToBuyer :  
        new Schema({
            KFZBrief : {type : Boolean},
            Fahrzeugschein: {type : Boolean},
            Hauptuntersuchung: {type: Boolean},
            Schlüssel : {type: Number},
            description: {type: String}
        }),
        invoiceLink : {type: String},
    inGermany :{type: Boolean, required: true} // it must be a check box and define the deal is belong to germany or out of that.
})

ComissionAgreementSchema.plugin(timestampsPlugin)

module.exports = mongoose.model('ComissionAgreement' , ComissionAgreementSchema)
