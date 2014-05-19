
/*
 * Eric Yi on 2014-05-15
 * yi_xiaobin@163.com
 */

var month2chs = new Array('一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二');

function listCategory() {
  $.getJSON( '/category/list', function(data) {
    var contents = '';
    var n = 0;
    var top_path;
    $.each(data, function() {
      if (this.parent_id == 0) {
        top_path = this.path_name;
        if (n != 0)
          contents += '</ul></li>';
        contents += '<li class="cat-item">';
        contents += '<a href="javascript:categoryForArticle(\'' + top_path + '\')">' + this.name + '</a>';
        contents += '<ul class="children">';
      } else {
        contents += '<li class="cat-item">';
        contents += '<a href="javascript:categoryForArticle(\'' + top_path + '\', \'' + this.path_name + '\')">' + this.name + '</a>';
        contents += '</li>';
      }
      if (n == data.length - 1)
        contents += '</ul></li>';
      n++;
    });
    $('#yad_category').html(contents);
  });
}

function listFamily() {
  $.getJSON( '/family', function(data) {
    var contents = '';
    $.each(data, function(){
      contents += '<li><a href="/family/' + this.username + '">' + this.name + '</a></li>';
    });
    $('#yad_family').html(contents);
  });

}

function familyCategory() {
  $.getJSON( '/category', function(data) {
    var contents = '';
    var n = 0;
    var top_path;
    $.each(data, function() {
      var family_name = this.name;
      var categories = this.categories;
      if (n != 0)
        contents += '</ul></li>';
      contents += '<li class="cat-item">';
      contents += '<a href="category/' + family_name + '">' + family_name + '</a>';
      contents += '<ul class="children">';
      for (var m in categories) {
        var category = categories[m];
        if (category.parent_id == 0) {
          top_path = category.path_name;
          if (m != 0)
            contents += '</ul></li>';
          contents += '<li class="cat-item">';
          contents += '<a href="category/' + top_path + '">' + category.name + '</a>';
          contents += '<ul class="children">';
        } else {
          contents += '<li class="cat-item">';
          contents += '<a href="category/' + top_path + '/' + category.path_name + '">' + category.name + '</a>';
          contents += '</li>';
        }
        if (m == categories.length - 1)
          contents += '</ul></li>';
      }
      if (n == data.length - 1)
        contents += '</ul></li>';
      n++;
    });
    $('#yad_category').html(contents);
  });
}

function listLink() {
  $.getJSON( '/link', function(data) {
    var contents = '';
    $.each(data, function(){
      contents += '<li><a onclick="javascript:_gaq.push([\'_trackEvent\',\'outbound-blogroll\',\'' + this.url + '\']);" target="_blank" href="' + this.url + '">' + this.name + '</a></li>';
    });
    $('#yad_link').html(contents);
  });
}

function listArticle() {
  $.getJSON('/parameters', function(parameters) {
    var auth = parameters.auth;
    $.getJSON('/article', function(data) {
      var contents = makeContents(data, auth);
      $('#content').html(contents);
    });
  });
}

function pageForArticle(page_num) {
  $.getJSON('/parameters', function(parameters) {
    var auth = parameters.auth;
    if (!page_num) page_num = 0;
    $.getJSON( '/page/'+page_num, function(data) {
      var contents = makeContentsInPage(data, page_num, auth, null, null);
      $('#content').html(contents);
    });
  });
}

function categoryForArticle(c_root, c_child, page_num) {
  $.getJSON('/parameters', function(parameters) {
    var auth = parameters.auth;
    child = '';
    if (!page_num) page_num = 0;
    if (c_child) child = '/' + c_child;
    var url = '/category/' + c_root + child + '?page=' + page_num;
    $.getJSON(url, function(data) {
      var contents = makeContentsInPage(data, page_num, auth, c_root, c_child);
      $('#content').html(contents);
    });
  });

}

function makeContentsInPage(data, page_num, auth, c_root, c_child) {
  var contents = makeContents(data.dataset, auth);
  var page = data.page;
  var hasPrev = (page.num != 0) ? true : false;
  var position = page.num * page.size + parseInt(page.current);
  var hasNext = (position < page.total) ? true : false;
  if (hasPrev || hasNext) {
    contents += '<div class="navlink">'
    var page_num;
    if (hasPrev) {
      page_num = parseInt(page.num) - 1;
      if (c_root) {
        var child = 'null';
        if (c_child)
          child = '\'' + c_child + '\'';
        contents += '<a href="javascript:categoryForArticle(\'' + c_root + '\', ' + child + ', \'' + page_num + '\')">' + page.prev + '</a>';
      } else {
        contents += '<a href="javascript:pageForArticle(' + page_num + ')">« ' + page.prev + '</a>';
      }
    }
    if (hasPrev && hasNext)
      contents += ' — ';
    if (hasNext) {
      page_num = parseInt(page.num) + 1;
      if (c_root) {
        var child = 'null';
        if (c_child)
          child = '\'' + c_child + '\'';
        contents += '<a href="javascript:categoryForArticle(\'' + c_root + '\', ' + child + ', \'' + page_num + '\')">' + page.next + '</a>';
      } else {
        contents += '<a href="javascript:pageForArticle('+ page_num + ')">' + page.next + ' »</a>';
      }
    }
    contents += '</div>';
  }

  return contents;
}

YadDate = function(pub_date) {
	var year = pub_date.getFullYear();
  var month = month2chs[pub_date.getMonth()];
  var day = pub_date.getDate();
	return {
		year: year,
		month : month,
		day: day
	};
};

function splitTime(publish_time) {
	var pub_date = new Date(Date.parse(publish_time));
	var yad_date = new YadDate(pub_date);
	return yad_date;
}

function makeContents(data, auth) {
  var contents = '';
  $.each(data, function() {
    var pub_date = new Date(Date.parse(this.publish_time));
    var year = pub_date.getFullYear();
    var month = pub_date.getMonth();
    var day = pub_date.getDate();
    contents += '<div class="datecomrap">';
    contents += '<div class="date">';
    contents += month2chs[month] + '<br />';
    contents += '<span style="font-size:2em; font-weight:bold;">' + day + '</span><br />';
    contents += year;
    contents += '</div>';
    contents += '<div class="commy">';
    contents += '<a href="javascript:readArticle(' + this.id + ')" class="comments-link"  title="' + this.title + '">' + this.reply_num + '</a> ';
    contents += '</div>';
    contents += '</div>';

    contents += '<div class="storywrap">';
    contents += '<div class="post" id="' + this.id + '">';
    contents += '<h3 class="storytitle"><a href="javascript:readArticle(' + this.id + ')" rel="bookmark">' + this.title + '</a></h3>';
    contents += '<div class="storycontent">';
    contents += '<p>tt</p>';
    contents += '</div>';
    contents += '<div class="meta">';
    contents += 'Written by ' + this.writer + ' in: <a href="/category/' + this.category_parent_path_name + '/' + this.category_path_name + '" rel="category tag">' + this.category_name + '</a>,';
    contents += '<a href="/category/' + this.category_parent_path_name + '" rel="category tag">' + this.category_parent_name + '</a> | <br />';
    contents += '</div>';
    contents += '</div>';
    contents += '</div>';
  });

  return contents;
}

function readArticle(id) {
  $.get( '/article/'+id, function(data) {
		var content = '<div class="datecomrap">';
		content += '<div class="date">';
  	$.getJSON( '/article/'+id+'/parameter', function(parameter) {
			if (parameter.publish_time) {
				var split_date = splitTime(parameter.publish_time);
				content += split_date.month + '<br />';
				content += '<span style="font-size:2em; font-weight:bold;">' + split_date.day + '</span><br />';
				content += split_date.year;
			};
			content += '</div>';
			content += '</div>';
			content += data;
    	$('#content').html(content);
		});
  });
}

function listRecentArticle() {
  $.getJSON('/recent/article', function(data) {
		var content = '';
    $.each(data, function() {
			content += '<li>';
    	content += '<a href="javascript:readArticle(' + this.id + ')">' + this.title + '</a> ';
			content += '</li>';
		});
		$('#yad_article_recent').html(content);
	});
}

function listRecentReply() {
  $.getJSON('/recent/reply', function(data) {
		var content = '';
    $.each(data, function() {
			content += '<li class="recentcomments">';
			content += '<a href="#" rel="external nofollow" class="url">' + this.auth + '</a>';
			content += '发表在';
    	content += '《<a href="javascript:readArticle(' + this.article_id + ')">' + this.title + '</a>》';
			content += '</li>';
		});
		$('#recentcomments').html(content);
	});
}

function init() {
  listFamily();
  listCategory();
	listRecentArticle();
	listRecentReply();
  listLink();
}
