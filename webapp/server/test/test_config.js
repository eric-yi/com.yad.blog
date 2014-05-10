/*
 * Eric Yi on 2014-05-08
 * yi_xiaobin@163.com
 */

var Config = require('../config');
var config = Config.getConfig();
config.init('../../yad_blog.cfg');
var v = config.getServer().getHost();
console.log(v);
