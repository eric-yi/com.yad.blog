
/*
 * Eric Yi on 2014-05-12
 * yi_xiaobin@163.com
 */

function test() {
	var Config = require('../config');
  var config = Config.getConfig();
  config.init('../../yad_blog.cfg');
  var database = config.getDatabase();
  var DaoFactory = require('../dao/dao_factory');
	var dao_factory = DaoFactory.getFactory();
	dao_factory.createDao('mysql');
  var dao = dao_factory.getDao();
	dao.init(config.getDatabase());
	var Service = require('../service/service');
	var service = Service.getService();
	service.setDao(dao);
//	test_getArticle(service);
	test_getCategory(service);
}

function test_getCategory(service) {
	service.getCategory(null, function(list) {
		for (var n in list) {
			var category = list[n];
			console.log(category.getId() + ',' + category.getName());
		}
	});
}

function test_getArticle(service) {
	service.getArticle(null, function(list) {
		for (var n in list) {
			var article = list[n];
			console.log(article.getId() + ',' + article.getTitle() + ',' + article.getPath_name() + ',' + article.getPublish_time());
		}
	});
}

test();
