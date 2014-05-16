#!/usr/bin/env node

var debug = require('debug')('http');
var config_path;

function arg_opt() {
  var arguments = process.argv.splice(2);
  if (arguments.length > 0) {
    arguments.forEach(function(val, index, array) {
      if (index == 0)		config_path = val;
    });
  }
}

var server;
function init() {
	Global = require('./global');
	var global = Global.getGlobal();
	if (config_path)		global.setConfig_path(config_path);	
	global.init();
  server = global.getServer();
}

function start() {
  var app = require('./app');
  var webServer = app.listen(server.port, function() {
    debug('Express server listening on port ' + webServer.address().port);
  });

}

function main() {
  arg_opt();
  init();
  start();
}

main();
