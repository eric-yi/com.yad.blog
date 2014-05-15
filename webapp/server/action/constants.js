
/*
 * Eric Yi on 2014-05-13
 * yi_xiaobin@163.com
 */

Global = require('../global');
var global = Global.getGlobal();

exports.parameters = {
	title:      	global.getBlog().getTitle(),
	subtitle:   	global.getBlog().getSubtitle(),
	auth:					global.getBlog().getAuth(),
	auth_alias:		global.getBlog().getAuth_alias(),
	email:				global.getBlog().getEmail()
};

exports.parameters_json = '{' +
	'"title":"' + global.getBlog().getTitle() + '",' +
	'"subtitle":"' + global.getBlog().getSubtitle() + '",' +
	'"auth":"' + global.getBlog().getAuth() + '",' +
	'"auth_alias":"' + global.getBlog().getAuth_alias() + '",' +
	'"email":"' + global.getBlog().getEmail() + '"' +
'}';

