
/*
 * Eric Yi on 2014-05-09
 * yi_xiaobin@163.com
 */


function test() {
  var Config = require('../config');
  var config = Config.getConfig();
  config.init('../../yad_blog.cfg');
  var database = config.getDatabase();
  var Dao = require('../dao/dao');
  var dao = Dao.getDao();
  dao.init(database);
  dao.query('select 1+1', function(results) {
    for (var row in results) {
      console.log(results[row]);
    }
  });
}

test();
