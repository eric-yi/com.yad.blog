/*
 * Eric Yi on 2014-05-25
 * yi_xiaobin@163.com
 */

crypto_util = require('../common/crypto_util');

function test_md5() {
  var str = 'yad';
  var md5_str = crypto_util.md5(str);
  console.log(md5_str);
}

function test() {
  test_md5();
}

test();
