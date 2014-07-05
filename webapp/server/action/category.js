
/*
 * Eric Yi on 2014-05-15
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
Base = require('./base');
ModelProxy = require('../model/model_proxy');
string_util = require('../common/string_util');

router.get('/', function(req, res) {
  Base.getCategoryInFamily(null, function(categories) {
    var json = ModelProxy.toCategoryJson(categories);
    res.send(json);
  });
});

router.get('/list', function(req, res) {
  Base.getCategories(null, function(categories) {
    var json = ModelProxy.toJson(categories);
    res.send(json);
  });
});

router.get('/:id/families', function(req, res) {
  Base.service.getFamiliesInCategory(req.params.id, function(families) {
    var json = ModelProxy.toFamilyJson(families);
    res.send(json);
  });
});

router.get('/:id/delete', function(req, res) {
  Base.tipLogin(req, res, function() {
    var id = req.params.id;
    Base.service.deleteCategory(id, function(result) {
      Base.sendMessage(res, result);
    });
  });
});

router.post('/add', function(req, res) {
  Base.tipLogin(req, res, function() {
    var parent_id = string_util.formToSql(req.body.a_category_id, '"');
    var name = string_util.formToSql(req.body.a_category_name, '"');
    var path_name = string_util.formToSql(req.body.a_category_path, '"');

    var category = ModelProxy.copyCategory({
      name:       name,
      path_name:  path_name,
      parent_id:  parent_id
    });
    Base.service.addCategory(category, function(result) {
      Base.sendMessage(res, result);
    });
  });
});

router.post('/:id/edit', function(req, res) {
  Base.tipLogin(req, res, function() {
    console.log(req.body);
    var id = req.params.id;
    var name = string_util.formToSql(req.body.e_category_name, '"');
    var family_ids = req.body.e_category_family;
    var category = ModelProxy.copyCategory({
      id:         id,
      name:       name
    });
    var params = {category: category, family_ids: family_ids};
    Base.service.updateCategory(params, function(result) {
      Base.sendMessage(res, result);
    });
  });
});

router.get('/family/:id', function(req, res) {
  var id = req.params.id;
  Base.service.getCategoriesInFamily(id, function(categories) {
    var json = ModelProxy.toJson(categories);
    res.send(json);
  });
});

router.get('/family/:id/root', function(req, res) {
  var id = req.params.id;
  Base.service.getRootCategoriesInFamily(id, function(categories) {
    var json = ModelProxy.toJson(categories);
    res.send(json);
  });
});

router.get('/:id/children', function(req, res) {
  var id = req.params.id;
  Base.service.getSecondCategories(id, function(categories) {
    var json = ModelProxy.toJson(categories);
    res.send(json);
  });
});

module.exports = router;
