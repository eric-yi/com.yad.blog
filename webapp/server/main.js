#!/usr/bin/env node

var path = require('path');
var debug = require('debug')('http');
var config_path = path.join(__dirname, '..', 'yad_blog.cfg');
console.log(config_path);

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
  var Config = require('./config');
  var config = Config.getConfig();
	config.init(config_path)
  server = config.getServer();
}

function start() {
  var app = require('./app');
  var webServer = app.listen(server.getPort(), function() {
    debug('Express server listening on port ' + webServer.address().port);
  });

}

function main() {
  arg_opt();
  init();
  start();
}

main();
