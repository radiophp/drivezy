const mongoose = require('mongoose')
const timestampsPlugin = require('mongoose-timestamp')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')


const DealSchema = new Schema({
    car : {type : Schema.Types.ObjectId, ref:'Car', required: true},
    customer : {type : Schema.Types.ObjectId, ref:'Customer', required: true},
    type : {type : String, required : true, enum: ['sell', 'buy']},
    amount: {type: Number, required: true},
    user : {type : Schema.Types.ObjectId, ref: 'User', required: true},
})

DealSchema.plugin(timestampsPlugin)

module.exports = mongoose.model('Deal' , DealSchema)