const Controller = require('../Controller')
const UserTransform = require('../../../transforms/UserTransform')

module.exports = new class UserController extends Controller{
  
    index(req , res){
      return res.json({
        data : new UserTransform().transfrom(req.user)
      })
    }

    uploadImage(req, res) {
   //    res.json(req.file);
      if(req.file) {
         return res.json({
              message : 'فایل شما با موفقیت آپلود گردید',
              data : {
                  imagePath : 'http://localhost:8080/' + req.file.path.replace(/\\/g , '/') 
              },
              success : true
          })
      } else {
         return res.json({
              message : 'فایل شما آپلود نشد',
              success : false
          })
      }
  }
}