/*
 * Eric Yi on 2014-05-08
 * yi_xiaobin@163.com
 */

var stringUtil = require('./common/stringUtil');

Server = function() {
  this.host = '0.0.0.0';
  this.port = 80;
};

Server.prototype = function() {
  setHost = function(h) {
    this.host = h;
  },

  getHost = function() {
    return this.host;
  },

  setPort = function(p) {
    this.port = p;
  },

  getPort = function() {
    return this.port;
  }

  return {
    setHost: setHost,
    getHost: getHost,
    setPort: setPort,
    getPort: getPort
  }
} ();

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

Config = function() {
  this.props = [];
  this.server = new Server();
  this.database = new Database();
  this.x = 1;
};

Config.prototype.init = function(path) {
  var content = require('fs').readFileSync(path, 'ascii');
  var qs = require('querystring');
  var articles = qs.parse(content, '[', ']');
  var entry;
  for (var a in articles) {
    if (a != '' && articles[a] != '') {
      this.props[stringUtil.trim(a)] = [];
      entries = qs.parse(articles[a], '\n', '=');	
      for (var e in entries) {
        if (e != '' && entries[e] != '') {
          ak = stringUtil.trim(a);
          ek = stringUtil.trim(e);
          this.props[ak][ek] = stringUtil.trim(entries[e]);
        }
      }
    }
  }

  this.server.setHost(
    get(this.props, 'server', 'host')
  );
  this.server.setPort(
    get(this.props, 'server', 'port')
  );

  this.database.setHost(
    get(this.props, 'database', 'host')
  );
  this.database.setPort(
    get(this.props, 'database', 'port')
  );
  this.database.setUsername(
    get(this.props, 'database', 'username')
  );
  this.database.setPassword(
    get(this.props, 'database', 'password')
  );
  this.database.setName(
    get(this.props, 'database', 'name')
  );
  this.database.setMax_connections(
    get('database', 'max_connection')
  );
};

Config.prototype.getServer = function() {
  return this.server;
};

Config.prototype.getDatabase = function() {
  return this.database;
};

get = function(props, a, e) {
  if (a == null || e == null) return null;
  if (a != null)              a = stringUtil.trim(a)
  if (e != null)              e = stringUtil.trim(e)
  if (a == '' || e == '')     return null;
  return props[a][e];
};

var config = new Config();
exports.getConfig = function() {
  return config;
};
