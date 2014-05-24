/*
 * eric yi on 20140-05-07
 * yi_xiaobin@163.com
 */

var Routes = function(app) {
  var index = require('./index');
  var category = require('./category');
  var link = require('./link');
  var article = require('./article');
  var family = require('./family');
  var comment = require('./comment');
  var about = require('./about');

  app.use('/', index);
  app.use('/category', category);
  app.use('/link', link);
  app.use('/article', article);
  app.use('/family', family);
  app.use('/comment', comment);
  app.use('/about', about);
};

module.exports = function(app) {
  var routes = new Routes(app);

  function getRoutes() {
    return routes;
  }

  return {
    create: getRoutes
  };
};
