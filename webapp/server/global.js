
/*
 * Eric Yi on 2014-05-13
 * yi_xiaobin@163.com
 */

Global = function() {
  var path = require('path');
  this.config_path = path.join(__dirname, '..', 'yad_blog.cfg');
  this.config;
}

Global.prototype.setConfig_path = function(config_path) {
  this.config_path = config_path;
};

Global.prototype.init = function() {
  var Config = require('./config');
  this.config = Config.getConfig();
  this.config.init(this.config_path);
};

Global.prototype.getServer = function() {
  return this.config.server;;
};

Global.prototype.getBlog = function() {
  return this.config.blog;
};

Global.prototype.getDatabase = function() {
  return this.config.database;
};

Global.prototype.getLog = function() {
  return this.config.log;
};

Global.prototype.getResume = function() {
  return this.config.resume;
};

var global = new Global();
exports.getGlobal = function() {
  return global;
};
