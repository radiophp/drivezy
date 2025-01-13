const Transform = require('./Transform')
const jwt = require('jsonwebtoken')
const config = require('../config')


module.exports = class UserTransform extends Transform{

    transfrom(item , createToken = false ){
        this.createToken = createToken
        return {
            '_id' : item._id,
            'name' : item.name,
            'family' : item.family,
            'email' : item.email,
            'roll' : item.roll,
            ...this.withToken(item)
        }
    }

    withToken(item){

        if(item.token){
            return {token : item.token}
        }
        if(this.createToken){
          let token = jwt.sign({user_id : item._id} , config.secret , {
            expiresIn: '110h'
           })

           return {token }
        }

        return {}
    }
}