const config = require("../../../config")

module.exports = new class HomeController{
    index (req, res){
        res.json('welcome to api')
    }

    ping(req, res){
        return res.json({
            success : true,
            data : {
                commit: config.current_package
            }
        })
    }
}