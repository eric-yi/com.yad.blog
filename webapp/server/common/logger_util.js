
/*
 * Eric Yi on 2014-07-22
 * yi_xiaobin@163.com
 */

var winston = require('winston');

Logger = function() {
	var _logger;
	var _config;
}

Logger.prototype.init = function(opt) {
	this._config = {
		exitOnError: false,
  	transports: [
			new (winston.transports.Console)({ level: opt.level }),
			new (winston.transports.File)({ filename: opt.common_log, level: opt.level })
		],
		exceptionHandlers: [
      new winston.transports.File({ filename: opt.error_log })
    ]
	};
	this._logger = new (winston.Logger)(this._config);
};

Logger.prototype.expressLogger = function() {
	return this._config;
}

Logger.prototype.info = function(msg) {
	this._logger.info(msg);
}

Logger.prototype.debug = function(msg) {
	this._logger.debug(msg);
}

Logger.prototype.warn = function(msg) {
	this._logger.warn(msg);
}

Logger.prototype.error = function(msg) {
	this._logger.error(msg);
}

var logger = new Logger();
exports.getLogger = function() {
		return logger;
};
