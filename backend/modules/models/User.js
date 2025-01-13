const mongoose = require('mongoose')
const timestampsPlugin = require('mongoose-timestamp')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')
const bcrypt = require('bcrypt')


const UserSchema = new Schema({
    name : {type: String, required:true},
    family : {type: String, required:true},
    email : {type : String, required : true , unique:true },
    password : {type: String, required:true},
    contactInfo : {type : String},
    avatar : {type : String},
    active : {type : Boolean, default : true},
    isVerified: { type: Boolean, default: false },
    roll: [{type : String, default : 'user'}]
})

UserSchema.plugin(timestampsPlugin)

// CustomerSchema.pre('save' , function(next){
//     bcrypt.hash(this.password, 10,(err, hash) => {
//         this.password = hash
//         next()
//     })
// })

module.exports = mongoose.model('User' , UserSchema)