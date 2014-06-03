function showLogin() {
  $.getJSON('/family/member/current', function(family) {
    if (family.id != null) {
      closeLoginBox();
    } else {
      showLoginBox();
    }
  });
}

function showLoginBox() {
  $('#login-box').fadeIn(300);
  var popMargTop = ($('#login-box').height() + 24) / 2;
  var popMargLeft = ($('#login-box').width() + 24) / 2;
  $('#login-box').css({
    'margin-top' : -popMargTop,
    'margin-left' : -popMargLeft
  });
  $('body').append('<div id="mask"></div>');
  $('#mask').fadeIn(300);
  $('#username').focus();
}

function closeLoginBox() {
  $('#mask, .login-popup').fadeOut(300 , function() {
    //('#mask').remove();
  });
}

function login() {
  if ($('#username').val() == ''&& $('#password').val() == '') {
    $('#_message').html('家庭成员和开门钥匙不能为空');
    return false;
  }

  if ($('#username').val() == '') {
    $('#_message').html('家庭成员不能为空');
    return false;
  }
  if ($('#password').val() == '') {
    $('#_message').html('开门钥匙不能为空');
    return false;
  }
  $.ajax({
    url: '/master/login',
    type: 'POST',
    data: $('#loginform').serialize(),
    success: function(message) {
      var message = $.parseJSON(message);
      if (message.success == 'true') {
        $('#_message').html('');
        closeLoginBox();
        refresh();
      } else {
        var msg = message.msg;
        if (msg == -1)
          $('#_message').html('家庭成员或开门钥匙不能为空');
        if (msg == -2)
          $('#_message').html('家庭成员或开门钥匙不正确');
        return false;
      }
    },
    error: function(message) {
      $('#_message').html(message);
    }
  });
}

function logout() {
  var a = confirm('出门了？');
  if (a) {
    $.getJSON('/master/logout', function() {
      refresh();
      $('#tool-container').hide();
      showLoginBox();
    });
  }
}

var member;
function familyCall(callback) {
  var isLogin = false;
  $.getJSON('/family/member/current', function(family) {
    if (family.id != null)
      isLogin = true;
    member = family;
    callback(isLogin, family);
  });
}

function fetchMember() {
  $.getJSON('/family/member/current', function(family) {
    member = family;
  });
}

function openMember() {
  $('#family_message').html('');
  familyCall(function(isLogin, family) {
    if (isLogin) {
      resetMember(family);
      showMember();
    }
  });
}

function resetMember(_member) {
  if (!_member)  _member = this.member;
  $('#family_id').val(_member.id);
  $('#family_name').val(_member.name);
  $('#family_password').val('');
  $('#family_repassword').val('');
  if (_member.email != 'undefined')
    $('#family_email').val(_member.email);
  else
    $('#family_email').val('');
  if (_member.qq != 'undefined')
    $('#family_qq').val(_member.qq);
  else
    $('#family_qq').val('');
  if (_member.weibo != 'undefined')
    $('#family_weibo').val(_member.weibo);
  else
    $('#family_weibo').val('');
  if (_member.weico != 'undefined')
    $('#family_weico').val(_member.weico);
  else
    $('#family_weico').val('');
}

function showMember() {
  $('#member-box').fadeIn(300);
  var popMargTop = ($('#member-box').height() + 24) / 2;
  var popMargLeft = ($('#member-box').width() + 24) / 2;
  $('#member-box').css({
    'margin-top' : -popMargTop,
    'margin-left' : -popMargLeft
  });
  $('body').append('<div id="mask"></div>');
  $('#mask').fadeIn(300);
  $('#family_name').focus();
}

function closeMember() {
  $('#family_message').html('');
  $('#member-box').fadeOut(300 , function() {
    $('#mask').remove();
  });
}

function editMember() {
  var a = confirm('确认修改吗？');
  if (!a) {
    return false;
  }
  if ($('#family_name').val() == ''&& $('#family_name').val() == '') {
    $('#family_message').html('名字不能为空');
    return false;
  }
  if ($('#family_password').val() != '' && $('#family_password').val() != $('#family_repassword').val()) {
    $('#family_message').html('钥匙更换不符合要求');
    return false;
  }
  var family_id = $('#family_id').val();
  $.ajax({
    url: '/family/' + family_id + '/edit',
    type: 'POST',
    data: $('#memberform').serialize(),
    success: function(message) {
      var message = $.parseJSON(message);
      if (message.success == 'true') {
        $('#family_message').html('修改完成');
        fetchMember();
      } else {
        var msg = message.msg;
        if (msg == -1)
          $('#family_message').html('修改失败');
        return false;
      }
    },
    error: function(message) {
      $('#family_message').html(message);
    }
  });
}

function enterPost() {
  familyCall(function(isLogin, family) {
    if (isLogin) {
			$.getJSON('/category/family/'+family.id+'/root', function(roots) {
      	var content = '<form id="article_add_form" class="postform">';
      	content += '<fieldset class="textbox">';
      	content += '<label>';
      	content += '<span>分 类：</span>';
				content += '<select id="root_cat" onchange="javascript:loadChildCategory(this.value);">';
				$.each(roots, function() {
					content += '<option value="' + this.id + '">' + this.name + '</option>';
				});
				content += '</select>';
				content += '<select id="child_cat">'
				content += '</select>';
      	content += '</label>';
      	content += '<label>';
      	content += '<span>标 题：</span>';
      	content += '<input id="title" name="title" value="" type="text">';
      	content += '</label>';
      	content += '<label>';
      	content += '<span>内 容：</span>';
      	content += '<textarea id="post-editor" name="post-editor">'
      	content += '</textarea>';
      	content += '</label>';
      	content += '<p align="right">';
      	content += '<input type="hidden" id="family_id" name="family_id" value="' + family.id +  '" />';
      	content += '<input type="hidden" id="category_id" name="category_id" value="" />';
      	content += '<button type="button">保 存</button>';
      	content += '<button type="button" onclick="javascript:publishArticle();">发 布</button>';
      	content += '</p>';
      	content += '</fieldset>';

      	content += '</form>';
				content += '<script>loadChildCategory($("#root_cat").val())</script>';
      	$('#content').html(content);
      	$('#post-editor').ckeditor();
			});
    }
  });
}

function loadChildCategory(root_id) {
	$.getJSON('/category/'+root_id+'/children', function(categories) {
		var content = '<option value="-1">根</optioni>';
		$.each(categories, function() {
			content += '<option value="' + this.id + '">' + this.name + '</option>';
		});
		$('#child_cat').html(content);
	});
}

function publishArticle() {
	familyCall(function(isLogin, family) {
    if (isLogin) {
			if ($('#title').val() == '') {
				alert('标题不能为空');
				return false;
			}
			if ($('#post-editor').val() == '') {
				alert('内容不能为空');
				return false;
			}
			var root_cat = $('#root_cat').val();
			var child_cat = $('#child_cat').val();
			$('#category_id').val(root_cat);
			if (child_cat != -1) {
				$('#category_id').val(child_cat);
			}
			$.ajax({
				url: '/article/add',
				type: 'POST',
				data: $('#article_add_form').serialize(),
				success: function(message) {
					if (message.success == 'true') {
						alert('发布完成');
					} else {
				 		alert('Error: ' + message.msg);
						return false;
					}
				},
				error: function(message) {
					alert('Server Error:' + message);
				}
			});
		} else {
			alert('进家后，才能发布');
		}
	});
}

function openPost() {
  familyCall(function(isLogin, family) {
    if (isLogin) {
      showPost();
    }
  });
}

function showPost() {
  $('#post-box').fadeIn(300);
  var popMargTop = ($('#post-box').height() + 24) / 2;
  var popMargLeft = ($('#post-box').width() + 24) / 2;
  $('#post-box').css({
    'margin-top' : -popMargTop,
    'margin-left' : -popMargLeft
  });
  $('body').append('<div id="mask"></div>');
  $('#mask').fadeIn(300);
}

function closePost() {
  $('#post-box').fadeOut(300 , function() {
    $('#mask').remove();
  });
}

function refresh() {
  familyCall(function(isLogin, family) {
    if (isLogin) {
      $('#options').show();
    } else {
      $('#options').hide();
    }
  });
}

refresh();

jQuery(document).ready(function($) {
  $('#btn-options').toolbar({
    content: '#toolbar-options',
    position: 'left-top',
    hideOnClick: true
  });
});

CKEDITOR.disableAutoInline = true;
/*
$(document).ready(function() {
  $('#post-editor').ckeditor();
});
*/
