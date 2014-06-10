
/*
 * Eric Yi on 2014-05-15
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
Base = require('./base');
ModelProxy = require('../model/model_proxy');

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

router.get('/:id/delete', function(req, res) {
  Base.tipLogin(req, res, function() {
    var id = req.params.id;
    Base.service.deleteCategory(id, function(result) {
      res.send(Base.Message.toSuccessJson());
    });
  });
});

router.post('/:id/edit', function(req, res) {
  Base.tipLogin(req, res, function() {
    var id = req.params.id;
    var name = req.body.name;
    var parent_id = req.body.parent_id;

    var category = ModelProxy.copyCategory({
      id:         id,
      name:       name,
      parent_id:  parent_id
    });
    Base.service.updateCatetory(category, function(result) {
      res.send(Base.Message.toSuccessJson());
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
