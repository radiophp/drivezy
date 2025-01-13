const mongoose = require('mongoose')
const timestampsPlugin = require('mongoose-timestamp')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')


const BaseInfoSchema = new Schema({
    address : {type: String},
    eoriNumber: {type: String},
    nettoStaticText: {type: String},
    ownerInfo: {type: String},
    taxOffice_St: {type: String},
    taxOffice_Ust: {type: String},
    IBAN: {type: String},
    BIC: {type: String},
    mwstStaticText: {type: String},
    dfzStaticText: {type: String},
    comissionAgreementStaticText: {type: String},
    shopOwnerCountry :{type: String, default: 'Deutschland'},
    shopOwnerCity: {type: String, default:'Langenhagen'},
    zipCode : {type : String},
    storeName : {type: String},
    plateNumber : {type : String},
    street : {type: String},
    invoiceNumberPrefix: {type: String, default : 24},
    invoiceNumber: {type: Number, default: 1}

})

BaseInfoSchema.plugin(timestampsPlugin)

module.exports = mongoose.model('BaseInfo' , BaseInfoSchema)
