const Controller = require('../../Controller')

module.exports = new class UserController extends Controller {
    index (req, res){
        this.model.User.find({} , (err, users)=>{
            if(err) throw err
            if(users){
                return res.status(200).json(users)
            }
        })
    }

    store (req, res){

        req.checkBody('name' , 'name is mandatory').notEmpty()
        req.checkBody('family' , 'family is mandatory').notEmpty()
        req.checkBody('email' , 'email is mandatory').notEmpty()
        req.checkBody('password' , 'password is mandatory').notEmpty()
        req.checkBody('username' , 'username is mandatory').notEmpty()

        this.escapeAndTrim(req, 'name family email password username')

        if(this.showValidationErrors(req, res))
            return

        let type
        if(req.hasOwnProperty('type')){
            type = req.body.type
        }
        else{
            type = 'user'
        }

        let newUser = new this.model.User({
            name : req.body.name,
            family : req.body.family,
            email : req.body.email,
            password : req.body.password,
            username : req.body.username,
            type 
        }).save(err =>{
            if(err) throw err
            res.status(200).json('user created')
        })
    }

    edit(req, res){

        req.checkParams('id' , 'the format is not correct').isMongoId()
        
        if(this.showValidationErrors(req , res))
            return 
  
       this.model.User.findByIdAndUpdate(req.params.id, {password : '123654'},(err , user)=>{
        if(err) throw err
        res.status(200).json('updated')
       })
    }

    updateType(req , res){

        req.checkBody('userId' , 'user id is mandatory').notEmpty()
        req.checkBody('type' , 'user type is mandatory').notEmpty()
        req.checkBody('action' , 'action is mandatory').notEmpty() //add or remove

        if(this.showValidationErrors(req , res))
        return 

         this.model.User.findById(req.body.userId , (err , user)=>{
            if(err) throw err

            if(user){
                let userType = user.type
             //   console.log(userType)
                if(req.body.action == 'add'){
                    userType.push(req.body.type)
                }
                else if(req.body.action == 'remove'){
                    let index = userType.indexOf(req.body.type)
                    if(index > -1){
                        userType.splice(index , 1)
                    }
                }
                this.model.User.findByIdAndUpdate(req.body.userId , {type : userType} , (err , user)=>{
                    if(err) throw err
                    return res.status(200).json({
                        success : true,
                        data : 'updated'
                    })
                })
            }
            else{
                return res.status(403).json({
                    success : false,
                    data : 'user not found'
                })
            }
        })

       

        

     }
} 