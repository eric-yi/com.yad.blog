
/*
 * Eric Yi on 2014-05-09
 * yi_xiaobin@163.com
 */

logger_util = require('../common/logger_util');
var logger = logger_util.getLogger();

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
  if (db.host)            this.host = db.host;
  if (db.port)            this.port = db.port;
  if (db.name)            this.database = db.name;
  if (db.username)        this.username = db.username;
  if (db.password)        this.password = db.password;
  if (db.max_connections) this.max_connections = db.max_connections;

  var mysql = require('mysql');
  this.pool = mysql.createPool({
    host:               this.host,
    port:               this.port,
    user:               this.username,
    password:           this.password,
    database:           this.database,
    max_connections:  this.max_connections
  });
};

MysqlPool.prototype.query = function(sql, callback) {
  query(this.pool, sql, callback);
};

MysqlPool.prototype.insert = function(sql, callback) {
  _iud(this.pool, sql, callback);
};

MysqlPool.prototype.insertReturnId = function(sql, callback) {
  var _pool = this.pool;
  _iudRetId(_pool, sql, function(id) {
    callback(id);
  });
};

MysqlPool.prototype.del = function(sql, callback) {
  _iud(this.pool, sql, callback);
};

MysqlPool.prototype.update = function(sql, callback) {
  _iud(this.pool, sql, callback);
};

MysqlPool.prototype.total = function(sql, callback) {
  var count_sql = 'select count(*) as total from (' + sql + ')';
  logger.debug('query total sql: ' + count_sql);
  query(this.pool, sql, function(results) {
    callback(results[0].total);
  });
};

function _iud(_pool, sql, callback) {
  _pool.getConnection(function(err, conn) {
    if (err) {
      console.log('Dababase connection error!');
      throw err;
    }

    conn.query(sql, function(err, results) {
      if (err) {
        console.log('Database query error!');
        throw err;
      }
      callback(results[0]);
    });

    conn.release(function(err) {
      if (err) {
        console.log('Database connection close error!');
        throw err;
      }
    });
  });
}

function _iudRetId(_pool, sql, callback) {
  _pool.getConnection(function(err, conn) {
    if (err) {
      console.log('Dababase connection error!');
      throw err;
    }

    conn.query(sql, function(err, results) {
      if (err) {
        console.log('Database query error!');
        throw err;
      }
      conn.query('select last_insert_id() as id', function(err, idrs) {
        if (idrs.length == 0)
          throw new Error('Error: get id after insert');
        var id = idrs[0]['id'];
        callback(id);
      });
    });

    conn.release(function(err) {
      if (err) {
        console.log('Database connection close error!');
        throw err;
      }
    });
  });
}

function query(_pool, sql, callback) {
  logger.debug('enter query in mysql dao');
  _pool.getConnection(function(err, conn) {
    if (err) {
      console.log('Dababase connection error!');
      throw err;
    }

    conn.query(sql, function(err, results) {
      if (err) {
        console.log('Database query error!');
        throw err;
      }
      logger.debug('resutls = ' + results);
      callback(results);
    });

    conn.release(function(err) {
      if (err) {
        console.log('Database connection close error!');
        throw err;
      }
    });
  });
}

function safeQuery(_pool, sql, params, callback) {
  _pool.getConnection(function(err, conn) {
    if (err) {
      console.log('Dababase connection error!');
      throw err;
    }

    conn.query(sql, params, function(err, results) {
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
}

var mysql_pool = new MysqlPool();
function getMysqlPool() {
  return mysql_pool;
}

exports.getDao = function() {
  return getMysqlPool();
};
