/*
 * Eric Yi on 2014-05-09
 * yi_xiaobin@163.com
 */

var mysql = require('mysql');
function connect(p_host, p_user, p_password, p_database, p_port) {
	if (!p_host)		p_host = '127.0.0.1';
	if (!p_user)		p_user = 'root';
	if (!p_password)	p_password = 'root';
	if (!p_database)	p_database = 'yad_blog';
	if (!p_port)		p_port = 3306;
	var conn = mysql.createConnection({
		host: p_host,
		user: p_user,
		password: p_password,
		database: p_database,
		port: p_port
	});
	conn.connect();
	return conn;
}

function create_pool() {
	var pool = mysql.createPool({

	});

}

function query(conn, sql) {
	conn.query(sql);
	conn.end();
}

function test() {
	var conn = connect();
	query(conn, 'select 1+1');
}

test();
