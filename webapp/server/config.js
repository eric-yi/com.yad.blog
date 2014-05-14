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

Blog = function() {
	this.article_path = 'articles';
	this.about_path = 'about.html';
	this.title = '伊爱戴@钟爱一生';
	this.subtitle = '媛媛心爱，苗苗心疼';
	this.auth = '伊爱戴';
	this.auth_alias = 'yad';
	this.email = 'yi_xiaobin@163.com';
};

Blog.prototype.setArticle_path = function(article_path) {
	this.article_path = article_path;
};

Blog.prototype.getArticle_path = function() {
	return this.article_path;
};

Blog.prototype.setAbout_path = function(about_path) {
	this.about_path = about_path;
};

Blog.prototype.getAbout_path = function() {
	return this.about_path;
};

Blog.prototype.setTitle = function(title) {
	this.title = title;
};

Blog.prototype.getTitle = function() {
	return this.title;
};

Blog.prototype.setSubtitle = function(subtitle) {
	this.subtitle = subtitle;
};

Blog.prototype.getSubtitle = function() {
	return this.subtitle;
};

Blog.prototype.setAuth = function(auth) {
	this.auth = auth;
};

Blog.prototype.getAuth = function() {
	return this.auth;
};

Blog.prototype.setAuth_alias = function(auth_alias) {
	this.auth_alias = auth_alias;
};

Blog.prototype.getAuth_alias = function() {
	return this.auth_alias;
};

Blog.prototype.setEmail = function(email) {
	this.email = email;
};

Blog.prototype.getEmail = function() {
	return this.email;
};

Config = function() {
  this.props = [];
  this.server = new Server();
  this.database = new Database();
	this.blog = new Blog();
  this.x = 1;
};

Config.prototype.init = function(path) {
  var content = require('fs').readFileSync(path, 'utf-8');
  var qs = require('querystring');
  var articles = qs.parse(content, '[', ']');
  var entry;
  for (var a in articles) {
    if (a != '' && articles[a] != '') {
      ak = stringUtil.trim(a);
			if (ak != '' && ak.charAt(0) != '#') {
      	this.props[ak] = [];
      	entries = qs.parse(articles[a], '\n', '=');	
      	for (var e in entries) {
        	if (e != '' && entries[e] != '') {
          	ek = stringUtil.trim(e);
						if (ek != '' && ek.charAt(0) != '#')
          		this.props[ak][ek] = stringUtil.trim(entries[e]);
        	}
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

	this.blog.setArticle_path(
		get(this.props, 'blog', 'article_path')
	);
	this.blog.setAbout_path(
		get(this.props, 'blog', 'about_path')
	);
	this.blog.setTitle(
		get(this.props, 'blog', 'title')
	);
	this.blog.setSubtitle(
		get(this.props, 'blog', 'subtitle')
	);
	this.blog.setAuth(
		get(this.props, 'blog', 'auth')
	);
	this.blog.setAuth_alias(
		get(this.props, 'blog', 'auth_alias')
	);
	this.blog.setEmail(
		get(this.props, 'blog', 'email')
	);
};

Config.prototype.getServer = function() {
  return this.server;
};

Config.prototype.getDatabase = function() {
  return this.database;
};

Config.prototype.getBlog = function() {
	return this.blog;
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
