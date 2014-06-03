
/*
 * Erci Yi on 2014-05-18
 * yi_xiaobin@163.com
 */

file_util = require('../common/file_util');
function test() {
	test_write();
}

function test_mkdir() {
  file_util.mkdir('/data/src/yi_xiaobin@github.com/com.yad.blog/webapp/articles');
}

function test_write() {
	try {
		file_util.write('./test', 'sdfsdfsdf');
	} catch (e) {
		console.log(e);
	}
}

test();
