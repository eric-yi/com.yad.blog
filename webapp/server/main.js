#!/usr/bin/env node

var debug = require('debug')('http');
var config_path;
var server;
var blog;
var log;

function arg_opt() {
  var arguments = process.argv.splice(2);
  if (arguments.length > 0) {
    arguments.forEach(function(val, index, array) {
      if (index == 0) config_path = val;
    });
  }
}

function init() {
  Global = require('./global');
  FileUtil = require('./common/file_util');
  var global = Global.getGlobal();
  if (config_path)  global.setConfig_path(config_path);	
  global.init();
  server = global.getServer();
  blog = global.getBlog();
  FileUtil.mkdir(blog.article_path);
	log = global.getLog();
	FileUtil.mkdir(log.dir_path);
	var logger = require('./common/logger_util').getLogger();
	logger.init(log);
}

function start() {
  App = require('./app');
  server.view = App.get('views');
  var webServer = App.listen(server.port, function() {
    debug('Express server listening on port ' + webServer.address().port);
  });
}

function main() {
  arg_opt();
  init();
  start();
}

main();
