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

var Database = function() {
	var host = '127.0.0.1';
	var port = 3306;
	var username;
	var password;
	var name = 'yad_blog';
	var max_connections = 5;

	return {
		setHost: function(p_host) {
			host = p_host;
		},
		getHost: function() {
			return host;
		},

		setPort: function(p_port) {
			port = p_port;
		},
		getPort: function() {
			return port;
		},

		setUsername: function(p_username) {
			username = p_username;
		},
		getUsername: function() {
			return username;
		},

		setPassword: function(p_password) {
			password = p_password;
		},
		getPassword: function() {
			return password;
		},

		setName: function(p_name) {
			name = p_name;
		},
		getName: function(p_name) {
			return name;
		},

		setMax_connections: function(p_max_connections) {
			max_connections = p_max_connections;
		},
		getMax_connections: function() {
			return max_connections;
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
		server.setHost(
			get('server', 'host')
		);
		server.setPort(
			get('server', 'port')
		);	

		var database = new Database();
		database.setHost(
			get('database', 'host')
		);
		database.setPort(
			get('database', 'port')
		);
		database.setUsername(
			get('database', 'username')
		);
		database.setPassword(
			get('database', 'password')
		);
		database.setName(
			get('database', 'name')
		);
		database.setMax_connections(
			get('database', 'max_connection')
		);
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
		},
		getDatabase: function() {
			return database;
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


