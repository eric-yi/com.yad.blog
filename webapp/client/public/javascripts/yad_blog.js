
/*
 * Eric Yi on 2014-05-15
 * yi_xiaobin@163.com
 */

var month2chs = new Array('一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二');

function listCategory() {
  $.getJSON( '/category/list', function(data) {
    var content = '';
    var n = 0;
    var top_path;
    $.each(data, function() {
      if (this.parent_id == 0) {
        top_path = this.path_name;
        if (n != 0)
          content += '</ul></li>';
        content += '<li class="cat-item">';
        content += '<a href="javascript:categoryForArticle(\'' + top_path + '\')">' + this.name + '</a>';
        content += '<ul class="children">';
      } else {
        content += '<li class="cat-item">';
        content += '<a href="javascript:categoryForArticle(\'' + top_path + '\', \'' + this.path_name + '\')">' + this.name + '</a>';
        content += '</li>';
      }
      if (n == data.length - 1)
        content += '</ul></li>';
      n++;
    });
    $('#yad_category').html(content);
  });
}

function listFamily() {
  $.getJSON( '/family', function(data) {
    var content = '';
    $.each(data, function(){
      content += '<li><a href="javascript:familyForArticle(' + this.id + ')">' + this.name + '</a></li>';
    });
    $('#yad_family').html(content);
  });

}

function familyCategory() {
  $.getJSON( '/category', function(data) {
    var content = '';
    var n = 0;
    var top_path;
    $.each(data, function() {
      var family_name = this.name;
      var categories = this.categories;
      if (n != 0)
        content += '</ul></li>';
      content += '<li class="cat-item">';
      content += '<a href="category/' + family_name + '">' + family_name + '</a>';
      content += '<ul class="children">';
      for (var m in categories) {
        var category = categories[m];
        if (category.parent_id == 0) {
          top_path = category.path_name;
          if (m != 0)
            content += '</ul></li>';
          content += '<li class="cat-item">';
          content += '<a href="category/' + top_path + '">' + category.name + '</a>';
          content += '<ul class="children">';
        } else {
          content += '<li class="cat-item">';
          content += '<a href="category/' + top_path + '/' + category.path_name + '">' + category.name + '</a>';
          content += '</li>';
        }
        if (m == categories.length - 1)
          content += '</ul></li>';
      }
      if (n == data.length - 1)
        content += '</ul></li>';
      n++;
    });
    $('#yad_category').html(content);
  });
}

function listLink() {
  $.getJSON( '/link', function(data) {
    var content = '';
    $.each(data, function(){
      content += '<li><a onclick="javascript:_gaq.push([\'_trackEvent\',\'outbound-blogroll\',\'' + this.url + '\']);" target="_blank" href="' + this.url + '">' + this.name + '</a></li>';
    });
    $('#yad_link').html(content);
  });
}

function listArticle() {
  $.getJSON('/parameters', function(parameters) {
    var auth = parameters.auth;
    $.getJSON('/family/member/current', function(family) {
      $.getJSON('/article', function(data) {
        var content = makeContents(data, auth, family);
        $('#content').html(content);
      });
    });
  });
}

function pageForArticle(page_num) {
  $.getJSON('/parameters', function(parameters) {
    var auth = parameters.auth;
    $.getJSON('/family/member/current', function(family) {
      if (!page_num) page_num = 0;
      $.getJSON('/article/page/'+page_num, function(data) {
        var content = makeContentsInPage(data, page_num, auth, family, null, null, null);
        $('#content').html(content);
      });
    });
  });
}

function categoryForArticle(c_root, c_child, page_num) {
  $.getJSON('/parameters', function(parameters) {
    var auth = parameters.auth;
    $.getJSON('/family/member/current', function(family) {
      child = '';
      if (!page_num) page_num = 0;
      if (c_child) child = '/' + c_child;
      var url = '/article/category/' + c_root + child + '?page=' + page_num;
      $.getJSON(url, function(data) {
        var content = makeContentsInPage(data, page_num, auth, family, c_root, c_child, null);
        $('#content').html(content);
      });
    });
  });
}

function familyForArticle(fid, page_num) {
  $.getJSON('/parameters', function(parameters) {
    var auth = parameters.auth;
    $.getJSON('/family/member/current', function(family) {
      if (!page_num) page_num = 0;
      var url = '/article/family/' + fid + '?page=' + page_num;
      $.getJSON(url, function(data) {
        var content = makeContentsInPage(data, page_num, auth, family, null, null, fid);
        $('#content').html(content);
      });
    });
  });
}

function makeContentsInPage(data, page_num, auth, family, c_root, c_child, fid) {
  var content = makeContents(data.dataset, auth, family);
  var page = data.page;
  var hasPrev = (page.num != 0) ? true : false;
  var position = page.num * page.size + parseInt(page.current);
  var hasNext = (position < page.total) ? true : false;
  if (hasPrev || hasNext) {
    content += '<div class="navlink">'
    var page_num;
    if (hasPrev) {
      page_num = parseInt(page.num) - 1;
      if (c_root) {
        var child = 'null';
        if (c_child)
          child = '\'' + c_child + '\'';
        content += '<a href="javascript:categoryForArticle(\'' + c_root + '\', ' + child + ', \'' + page_num + '\')">' + page.prev + '</a>';
      } else if (fid) {
        content += '<a href="javascript:familyForArticle(' + fid + ', ' + page_num + ')">« ' + page.prev + '</a>';
      } else {
        content += '<a href="javascript:pageForArticle(' + page_num + ')">« ' + page.prev + '</a>';
      }
    }
    if (hasPrev && hasNext)
      content += ' — ';
    if (hasNext) {
      page_num = parseInt(page.num) + 1;
      if (c_root) {
        var child = 'null';
        if (c_child)
          child = '\'' + c_child + '\'';
        content += '<a href="javascript:categoryForArticle(\'' + c_root + '\', ' + child + ', \'' + page_num + '\')">' + page.next + '</a>';
      } else if (fid) {
        content += '<a href="javascript:familyForArticle('+ fid + ', ' + page_num + ')">' + page.next + ' »</a>';
      } else {
        content += '<a href="javascript:pageForArticle('+ page_num + ')">' + page.next + ' »</a>';
      }
    }
    content += '</div>';
  }

  return content;
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

function makeContents(data, auth, family) {
  var content = '';
  var family_id = -1;
	var member_id = -1;
  if (family.id != undefined)
    family_id = family.id;
  if (family.member_id != undefined)
    member_id = family.member_id;
  $.each(data, function() {
    var pub_date = new Date(Date.parse(this.publish_time));
    var year = pub_date.getFullYear();
    var month = pub_date.getMonth();
    var day = pub_date.getDate();
    content += '<div class="datecomrap">';
    content += '<div class="date">';
    content += month2chs[month] + '<br />';
    content += '<span style="font-size:2em; font-weight:bold;">' + day + '</span><br />';
    content += year;
    content += '</div>';
    content += '<div class="commy">';
    content += '<a href="javascript:readArticle(\'' + this.id + '\', \'comments\')" class="comments-link"  title="' + this.title + '">' + this.reply_num + '</a> ';
    content += '</div>';
    content += '</div>';

    content += '<div class="storywrap">';
    content += '<div class="post" id="' + this.id + '">';
    content += '<h3 class="storytitle"><a href="javascript:readArticle(' + this.id + ')" rel="bookmark">' + this.title + '</a>';
    if (member_id == 1 || this.family_id == family_id) {
      content += '<div id="storyop" style="float:right;font-size=9px;">';
			content += '<a onclick="editPost(' + this.id + ')"><i class="icon-edit"></i></a>';
			content += '<a onclick="deletePost(' + this.id + ')"><i class="icon-remove"></i></a>';
			content += '</div>';
    }
    content += '</h3>';

    content += '<div class="storycontent">';
    var summary = '';
    if (this.summary)
      summary = summaryToHtml(this.summary);
    content += summary;
    content += '</div>';
    content += '<div class="meta">';
    content += 'Written by <a href="javascript:familyForArticle(' + this.family_id + ')">'  + this.writer + '</a> in: <a href="javascript:categoryForArticle(\'' + this.category_parent_path_name + '\', \'' + this.category_path_name + '\')" rel="category tag">' + this.category_name + '</a>,';
    content += '<a href="javascript:categoryForArticle(\'' + this.category_parent_path_name + '\')" rel="category tag">' + this.category_parent_name + '</a> | <br />';
    content += '</div>';
    content += '</div>';
    content += '</div>';
  });

  return content;
}

function summaryToHtml(summary){
  return String(summary)
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&#39;/g, '\'')
  .replace(/&quot;/g, '"');
}

function readArticle(id, anchor) {
  $.get('/article/id/'+id, function(content) {
    $('#content').html(content);
  });
  if (anchor) {
    setAnchorById(anchor);
  } else {
    location.hash = '#';
  }
}

function setAnchorById(id) {
  var oid = $('#'+id);
  if (oid) {
    setTimeout(function() {
      location.hash = '#' + id;
    }, 200);
    return;
  }
  setTimeout("setAnchorById()", 200);
}

function listRecentArticle() {
  $.getJSON('/article/recent', function(data) {
    var content = '';
    $.each(data, function() {
      content += '<li>';
      content += '<a href="javascript:readArticle(' + this.id + ')">' + this.title + '</a> ';
      content += '</li>';
    });
    $('#yad_article_recent').html(content);
  });
}

function listRecentComment() {
  $.getJSON('/comment/recent', function(data) {
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

function addComment() {
  if ($('#author').val() == '' || $('#comment').val() == '') {
    alert('姓名或内容不能为空');
    return false;
  }
  var article_id = $('#article_id').val();
  $.ajax({
    url: '/comment/add',
    type: 'POST',
    data: $('#commentform').serialize(),
    success: function(message) {
      defReply();
      var message = $.parseJSON(message);
      if (message.success == 'true') {
        readArticle(article_id, 'comments');
      } else {
        alert('Error: ' + message.msg);
        return false;
      }
    },
    error: function(message) {
      defReply();
      alert('Server Error:' + message);
    }
  });
}

function addAboutComment() {
  if ($('#author').val() == '' || $('#comment').val() == '') {
    alert('姓名或内容不能为空');
    return false;
  }
  $.ajax({
    url: '/comment/add',
    type: 'POST',
    data: $('#commentform').serialize(),
    success: function(message) {
      defReply();
      var message = $.parseJSON(message);
      if (message.success == 'true') {
        about('comments');
      } else {
        alert('Error: ' + message.msg);
        return false;
      }
    },
    error: function(message) {
      defReply();
      alert('Server Error:' + message);
    }
  });
}


function moveReply(comment_id, reply_type) {
  location.hash = '#postcomment';
  $('#author').focus();
  $('#reply_id').val(comment_id);
  $('#reply_type').val(reply_type);
}

function defReply() {
  $('#reply_id').val(-1);
  $('#reply_type').val(-1);
}

function about(anchor) {
  $.get('/about', function(content) {
    $('#content').html(content);
  });
  if (anchor) {
    setAnchorById(anchor);
  } else {
    location.hash = '#';
  }

}

function init() {
  listFamily();
  listCategory();
  listRecentArticle();
  listRecentComment();
  listLink();
	pageForArticle();
}

