
/*
 * Eric Yi on 2014-07-22
 * yi_xiaobin@163.com
 */

var global = require('../global').getGlobal();
var logger = require('../common/logger_util').getLogger();

function test() {
	global.init();
	logger.init(global.getLog());
	logger.info('this is a test!');
	logger.debug('this is a debug log!');
	logger.warn('this is a warn log!');
	logger.error('this is a error log!');
}

test();
