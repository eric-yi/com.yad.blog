/*
 * Eric Yi on 2014-05-08
 * yi_xiaobin@163.com
 */

var stringUtil = require('./common/stringUtil');

var Server = function() {
	var host = '0.0.0.0';
	var port = 80;

	return {
		setHost: function(h) {
			host = h;
		},
		getHost: function() {
			return host;
		},
		setPort: function(p) {
			port = p;
		},
		getPort: function() {
			return port;
		}
	};
};

var Config = function(path) {
	var props = [];
	{
		var content = require('fs').readFileSync(path, 'ascii');
		var qs = require('querystring');
		var articles = qs.parse(content, '[', ']');
		var entry;
		for (var a in articles) {
			if (a != '' && articles[a] != '') {
				props[stringUtil.trim(a)] = [];
				entries = qs.parse(articles[a], '\n', '=');	
				for (var e in entries) {
					if (e != '' && entries[e] != '') {
						ak = stringUtil.trim(a);
						ek = stringUtil.trim(e);
						props[ak][ek] = stringUtil.trim(entries[e]);
					}
				}
			}
		}

		var server = new Server();
		server.setHost(get('server', 'host'));
		server.setPort(get('server', 'port'));	
	}

	function get(a, e) {
		if (a == null || e == null)		return null;
		if (a != null)		a = stringUtil.trim(a)
		if (e != null)		e = stringUtil.trim(e)
		if (a == '' || e == '')			return null;
		return props[a][e];
	};

	return {
		get: get,
		getServer: function() {
			return server;
		}
	};
};

module.exports = function(path) {
	var config = new Config(path);
	function getConfig() {
		return config;
	}

	return {
		getCfg: getConfig
	};
};
