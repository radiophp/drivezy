const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
const cron = require('node-cron')
const helper = require('./helper')
global.config = require('./modules/config')
const dbPath = config.dbPath[process.env.NODE_ENV || 'development']

console.log(dbPath);
const logRequest = require('./accessLogger');
const moment = require ('moment')
const backup = require('mongodb-backup')
const path = require('path')
const dbBackup = require('./dbBackup')
const cors = require('cors'); 

cron.schedule('0 0 * * *', () => {
    dbBackup.backupMongoDB()
});   
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,POST,DELETE");

    next();
});

app.use(logRequest);
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json({ type : 'application/json'}))
app.use(expressValidator())
app.use('/public' , express.static('public')) 

mongoose.connect(dbPath)
mongoose.Promise = global.Promise

const webRouter = require('./modules/routes/web')
const apiRouter = require('./modules/routes/api/index')

cron.schedule("*/10 * * * *", function(){
  helper.checkForUnusedServices()
})

app.use('/' , webRouter)
app.use('/api' , apiRouter)

app.listen(config.port , async () => { 
  console.log(`server runninng on port  ${config.port}`);
})

 


