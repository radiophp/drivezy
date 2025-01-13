const Controller = require('../Controller')
const bcrypt = require('bcrypt')
const UserTransform = require('../../../transforms/UserTransform')

module.exports = new class AuthController extends Controller{
    login(req, res){
        req.checkBody('email' , 'name is mandatory').notEmpty()
        req.checkBody('password' , 'password is mandatory').notEmpty()
        req.checkBody('email' , 'email format is not correct').isEmail()

        if(this.showValidationErrors(req, res))
        return;

        req.body.email = req.body.email.toLowerCase()


        this.model.User.findOne({email: req.body.email} , (err , user)  => {
            if (err) throw err

            if(user == null){
                return res.status(422).json({
                    data : 'email is incorrect',
                    success : false
                })
            }

            bcrypt.compare(req.body.password , user.password , (err, status) =>{
                if(! status){
                    return res.status(422).json({
                        success : false,
                        data : 'not correct password'
                    })
                }

                return res.json({
                    data : new UserTransform().transfrom(user, true) ,
                    success : true
                })
            })
        } )
    }

   async register(req, res){

        req.checkBody('name' , 'name is mandatory').notEmpty()
        req.checkBody('family' , 'family is mandatory').notEmpty()
        req.checkBody('email' , 'email is mandatory').notEmpty()
        req.checkBody('password' , 'password is mandatory').notEmpty()
        req.checkBody('email' , 'email format is not correct').isEmail()

        this.escapeAndTrim(req, 'name family email password')

        if(this.showValidationErrors(req, res))
            return;

            req.body.email = req.body.email.toLowerCase()
            req.body.password = await new Promise ((resolve , reject)=>{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        reject(err)
                    }
                    else{
                        resolve(hash)
                    }
                }) 
            })
            
        this.model.User({
            name: req.body.name,
            family: req.body.family,
            email: req.body.email,
            password: req.body.password,
            roll : 'user'
        }).save(err => {
            if(err){
              if(err.code == 11000){
               return res.json({
                    data : 'duplicated value',
                    success : false
                })
              }
              else{
                throw err;
              }
            }  
           return res.json({
                data: 'registered!',
                success : true
            })  
        })
       
    }
    
}
 