const path = require('path')
require('dotenv').config()

module.exports = {
    port: process.env.PORT,
    servicePath : process.env.SERVICEPATH,
    secret : process.env.SECRET,
    current_package :  process.env.npm_package_gitHead,
    dbPath: {
      production: `mongodb+srv://${process.env.PROD_DB_USER}:${process.env.PROD_DB_PASS}@cluster0.7i3va0x.mongodb.net/Drivezy_Mix` ,
      development: process.env.MONGO_URI
    },
    path: {
            controller:{
                api : path.resolve('./modules/controllers/api'),
                web : path.resolve('./modules/controllers/web'), 
            }
    },
    sendgrid_api_key : process.env.SENDGRID_API_KEY  
}  
