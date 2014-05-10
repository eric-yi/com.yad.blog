
/*
 * Eric yi on 2014-05-10
 * yi_xiaobin@163.com
 */

function test() {
  Article = require('../model/article');
  var article = new Article();
  console.log(article.getId());
  article.setId(11);
  console.log(article.getId());
}

test();
