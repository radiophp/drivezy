const mongoose = require('mongoose')
const timestampsPlugin = require('mongoose-timestamp')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')



const CarSchema = new Schema({
    brand : {type : Schema.Types.ObjectId, ref:'Brand', required: true},
    color : {type : Schema.Types.ObjectId, ref:'Color'/*, required: true*/},
    model : {type : Schema.Types.ObjectId, ref:'Model', required: true},
    user : {type : Schema.Types.ObjectId, ref:'User', required: true},
    inWareHouse : {type: Boolean, default : true, required: true},
    // soldDate : {type: Date},
    soldDate: {
        type: Date,
        // Directly include the logic in the setter
        set: function(value) {
            // Check if the provided date is valid
            const timestamp = Date.parse(value);
            if (isNaN(timestamp)) {
                // Return the current date if the provided date is invalid
                return new Date();
            } else {
                // Return the provided date if it is valid
                return new Date(value);
            }
        }
    },
    bodyNo : {type: String, required:true},
    engineNo: {type:String},
    mileage: {type: String, required: true},
    year: {type: Number },
    description : {type: String}, 
    plateNo:{type: String /*, required: true*/},
    fuelType : {type : String, required: true},
    registeredDocumentNo:{type: String },
    HUAU:{type: String, required: true},
    firstRegistration:{type: String, required: true},
    accidentalDamage: {type: String, enum: ['yes', 'no', 'repaired'], required: true},
    accidentalDamageDescription: {type: String},
    image: [{type: String}], 
    outOfList : {type: Boolean, default : false},
    buyPrice : {type: Number},
    taxIncluded: {type: Boolean, default: false},
    tires : {type: Number},
    tiresType : {type: String},
    rims : {type: String},
    rimsSize : {type: String},
    files : [{type: String}]



})

CarSchema.plugin(timestampsPlugin)

module.exports = mongoose.model('Car' , CarSchema)
