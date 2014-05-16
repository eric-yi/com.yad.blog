
/*
 * Eric Yi on 2014-05-13
 * yi_xiaobin@163.com
 */

Global = require('../global');
var global = Global.getGlobal();

exports.parameters = {
	title:      	global.getBlog().title,
	subtitle:   	global.getBlog().subtitle,
	auth:					global.getBlog().auth,
	auth_alias:		global.getBlog().auth_alias,
	email:				global.getBlog().email
};

exports.parameters_json = '{' +
	'"title":"' + global.getBlog().title + '",' +
	'"subtitle":"' + global.getBlog().subtitle + '",' +
	'"auth":"' + global.getBlog().auth + '",' +
	'"auth_alias":"' + global.getBlog().auth_alias + '",' +
	'"email":"' + global.getBlog().email + '"' +
'}';

exports.page_size = global.getBlog().page_size;

