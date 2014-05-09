
/*
 * Eric Yi on 2014-05-09
 * yi_xiaobin@163.com
 */

function test() {
	var Config = require('../config');
	var config = new Config('../../yad_blog.cfg');
	var database = config.getCfg().getDatabase();
	var Dao = require('../dao/dao');
	var dao = new Dao(database).getDao();
	var datas = dao.query('select 1+1');
	for (var col in datas) {
		console.log(datas[col]);
	}
}

test();
