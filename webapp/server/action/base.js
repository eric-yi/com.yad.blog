
/*
 * Eric Yi on 2014-05-14
 * yi_xiaobin@163.com
 */

Global = require('../global');
var global = Global.getGlobal();

DaoFactory = require('../dao/dao_factory');
var dao_factory = DaoFactory.getFactory();
dao_factory.createDao('mysql');
var dao = dao_factory.getDao();
dao.init(global.getDatabase());

Service = require('../service/service');
var service = Service.getService();
service.setDao(dao);

Constants = require('./constants');

getCategories = function(category, callback) {
	service.getCategories(category, function(list) {
		var level1 = [];
		for (var n in list) {
			var category = list[n];
			if (category.getParent_id() == 0)
				level1.push(category);
		}
		level1.sort(function(c1, c2) {
			return c1.getPosition()>c2.getPosition() ? 1 : -1;
		});
		
		var arrs = [];
		for (var n in level1) {
			var l1 = level1[n];
			arrs.push(l1);
			var level2 = [];
			for (var m in list) {
				var l2 = list[m];
				if (l2.getParent_id() == l1.getId())
					level2.push(l2);
			}
			level2.sort(function(c1, c2) {
				return c1.getPosition()>c2.getPosition() ? 1 : -1;
			});
			for (var m in level2) {
				arrs.push(level2[m]);
			}
		}
		callback(arrs);
	});
};

getLinks = function(link, callback) {
	service.getLinks(link, function(list) {
		callback(list);	
	});
};

exports.getBaseDatas = function(callback) {
	getCategories(null, function(categories) { 
		getLinks(null, function(links) {
			var datas = {
  			blog: Constants.parameters,
	  		categories: categories,
				links: links
			};
			callback(datas);
		});
	});
};

exports.service = service;
