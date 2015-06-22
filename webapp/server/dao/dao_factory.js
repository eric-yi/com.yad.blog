
/*
 * Eric Yi on 2014-05-12
 * yi_xiaobin@163.com
 */

Factory = function() {
  this.dao;
};

Factory.prototype.createDao = function(type) {
  if (type == 'mysql') {
    MysqlDao = require('./mysql_dao');
    this.dao = MysqlDao.getDao();	
  }
};

Factory.prototype.getDao = function() {
  return this.dao;
};

var factory = new Factory();
exports.getFactory = function() {
  return factory;
}
