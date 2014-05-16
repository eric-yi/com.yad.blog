
/*
 * Eric Yi on 2014-05-15
 * yi_xiaobin@163.com
 */

function listCategory() {
	$.getJSON( '/category/list', function(data) {
		var contents = '';
		var n = 0;
		var top_path;
		$.each(data, function(){
			if (this.parent_id == 0) {
				top_path = this.path_name;
				if (n != 0)
					contents += '</ul></li>';
				contents += '<li class="cat-item">';
				contents += '<a href="category/' + top_path + '">' + this.name + '</a>';
				contents += '<ul class="children">';
			} else {
				contents += '<li class="cat-item">';
				contents += '<a href="category/' + top_path + '/' + this.path_name + '">' + this.name + '</a>';
				contents += '</li>';
			}
			if (n == data.length - 1)
				contents += '</ul></li>';
			n++;
		});
		$('#yad_category').html(contents);
	});
}

function listLink() {
	$.getJSON( '/link/list', function(data) {
		var contents = '';
		$.each(data, function(){
			contents += '<li><a href="http://' + this.url + '">' + this.name + '</a></li>';
		});
		$('#yad_link').html(contents);
	});
}

function listArticle() {
	$.getJSON('/parameters', function(parameters) {
		var auth = parameters.auth;
		$.getJSON( '/article/list', function(data) {
			var contents = '';
			$.each(data, function(){
				var pub_date = new Date(Date.parse(this.publish_time));
				var year = pub_date.getFullYear();
				var month = pub_date.getMonth();
				var day = pub_date.getDate();
				contents += '<div class="datecomrap">';
				contents += '<div class="date">';
				contents += month2Chs(month) + '<br />';
				contents += '<span style="font-size:2em; font-weight:bold;">' + day + '</span><br />';
				contents += year;
				contents += '</div>';
				contents += '<div class="commy">';
				contents += '<a href="#" class="comments-link"  title="' + this.title + '">' + this.reply_num + '</a> ';
				contents += '</div>';
				contents += '</div>';

				contents += '<div class="storywrap">';
				contents += '<div class="post" id="' + this.id + '">';
				contents += '<h3 class="storytitle"><a href="#" rel="bookmark">' + this.title + '</a></h3>';
				contents += '<div class="storycontent">';
				contents += '<p>tt</p>';
				contents += '</div>';
				contents += '<div class="meta">';
				contents += 'Written by ' + auth + ' in: <a href="/category/' + this.category_parent_path_name + '/' + this.category_path_name + '" rel="category tag">' + this.category_name + '</a>,';
				contents += '<a href="/category/' + this.category_parent_path_name + '" rel="category tag">' + this.category_parent_name + '</a> | <br />';
	
				contents += '</div>';
				contents += '</div>';
				contents += '</div>';
			});
			$('#content').html(contents);
		});
	});
}

var month_chs = new Array('一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
function month2Chs(month) {
		return month_chs[month];
};

function init() {
		listCategory();
		listLink();
}
