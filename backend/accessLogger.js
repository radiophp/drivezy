// Desc: This file is used to create the access logger for the application

const pino = require('pino');
const pinoHttp = require('pino-http');



// Define the logger with pretty formatting
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: true,
      singleLine:true,
      messageFormat: '{levelLabel} - method:{req.method}  - url:{req.url} status:{res.statusCode} - {msg} - {responseTime}ms -  body:{req.body} - ip:{req.ip} ',
      ignore: 'req,res'
    }
  }
})


// Create the pino-http middleware
const accessLogger = pinoHttp({ logger });

module.exports = accessLogger;

