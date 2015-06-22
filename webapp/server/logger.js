/*
 * Eric Yi on 2015-06-13
 * yi_xiaobin@163.com
 */

var winston = require('winston');
Global= require('../global');
var log = Global.getGlobal().getLog();

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: log.common_log, json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: log.err_log, json: false })
  ],
  exitOnError: false
});

module.exports = logger;

