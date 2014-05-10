
/*
 * Eric Yi on 2014-05-09
 * yi_xiaobin@163.com
 */

MysqlPool = function() {
  this.host = '127.0.0.1';
  this.port = 3306;
  this.database = 'yad_blog';
  this.username = 'yad';
  this.password = 'yad';
  this.max_connections = 5;
  this.pool;
};

MysqlPool.prototype.init = function(db) {
  if (db.getHost())             this.host = db.getHost();
  if (db.getPort())             this.port = db.getPort();
  if (db.getName())             this.database = db.getName();
  if (db.getUsername())         this.username = db.getUsername();
  if (db.getPassword())         this.password = db.getPassword();
  if (db.getMax_connections())  this.max_connections = db.getMax_connections();

  var mysql = require('mysql');
  this.pool = mysql.createPool({
    host:               this.host,
    port:               this.port,
    user:		this.username,
    password:		this.password,
    database:		this.database,
    max_connections:	this.max_connections
  });
};

MysqlPool.prototype.query = function(sql, callback) {
  this.pool.getConnection(function(err, conn) {
    if (err) {
      console.log('Dababase connection error!');
      throw err;
    }
    var q = conn.query(sql, function(err, results) {
      if (err) {
        console.log('Database query error!');
        throw err;
      }
      callback(results);
    });

    conn.release(function(err) {
      if (err) {
        console.log('Database connection close error!');
        throw err;
      }
    });
  });
};

var mysql_pool = new MysqlPool();
function getMysqlPool() {
  return mysql_pool;
}

exports.getDao = function() {
  return getMysqlPool();
};
