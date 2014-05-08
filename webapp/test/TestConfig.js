/*
 * Eric Yi on 2014-05-08
 * yi_xiaobin@163.com
 */

var Config = require('../config');
var config = new Config('../yadBlog.cfg');
var v = config.getCfg().getServer().getHost();
console.log(v);
