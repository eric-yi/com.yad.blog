
/*
 * Eric Yi on 2014-05-09
 * yi_xiaobin@163.com
 */

var MysqlPool = function(db) {
	var p_host = '127.0.0.1';
	var p_port = 3306;
	var p_database = 'yad_blog';
	var p_max_connections = 5;
	if (db.getHost())					p_host = db.getHost();
	if (db.getPort())					p_port = db.getPort();
	if (db.getName())					p_database = db.getName();
	if (db.getMax_connections())		p_max_connections = db.getMax_connections();
	var p_username = db.getUsername();
	var p_password = db.getPassword();

	var mysql = require('mysql');
	var pool = mysql.createPool({
		host: 				p_host,
		port: 				p_port,
		user:				p_username,
		password:			p_password,
		database:			p_database,
		max_connections:	p_max_connections
	});

	function query(sql) {
		pool.getConnection(function(err, conn) {
			conn.query(sql, function(err, dataset) {
				conn.release();
				return dataset;
			});
		});
	}

	return {
		query:	query
	};

};

module.exports = function(database) {
	var mysql_pool = new MysqlPool(database);

	function getMysqlPool() {
		return mysql_pool;
	}

	return {
		getDao:	getMysqlPool	
	};
};
