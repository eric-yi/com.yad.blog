document.write('<script type="text/javascript" src="/javascripts/yad_blog.js"></script>');

function showLogin() {
  $.getJSON('/family/member/current', function(family) {
    if (family.id != null) {
      closeLoginBox();
    } else {
      showBox({name:'login-box', focus:'username'});
    }
  });
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
        init();
        showToolbar();
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
      init();
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
      showBox({name:'member-box', focus:'family-name'});
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

function closeMember() {
  closeBox({name:'member-box', message:'family_message'});
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

function showPostContent(family, categories, article) {
  var content = '<form id="article_form" class="postform">';
  content += '<fieldset class="textbox">';
  content += '<label>';
  content += '<span>分 类：</span>';
  content += '<select id="root_cat" onchange="javascript:loadChildCategory(this.value);">';
  $.each(categories, function() {
    content += '<option value="' + this.id + '">' + this.name + '</option>';
  });
  content += '</select>';
  content += '<select id="child_cat">';
  content += '</select>';
  content += '</label>';
  content += '<label>';
  content += '<span>标 题：</span>';
  content += '<input id="title" name="title" value="" type="text">';
  content += '</label>';
  content += '<label>';
  content += '<span>内 容：</span>';
  content += '<textarea id="post-editor" name="post-editor">';
  content += '</textarea>';
  content += '</label>';
  content += '<p align="right">';
  content += '<input type="hidden" id="family_id" name="family_id" value="' + family.id +  '" />';
  content += '<input type="hidden" id="category_id" name="category_id" value="" />';
  if (article == null) {
    content += '<button type="button">保 存</button>';
    content += '<button type="button" onclick="javascript:publishArticle();">发 布</button>';
  } else {
    content += '<button type="button" onclick="javascript:cancelEditArticle();">取 消</button>';
    content += '<button type="button" onclick="javascript:editArticle(' + article.id + ');">确 认</button>';
  }
  content += '</p>';
  content += '</fieldset>';

  content += '</form>';
  content += '<script>loadChildCategory($("#root_cat").val(), null)</script>';
  $('#content').html(content);
  $('#post-editor').ckeditor();
  resetPostValue(article);
}

function resetPostValue(article) {
  if (article != null) {
    $('#title').val(article.title);
    if (article.category_parent_id != null) {
      $('#root_cat').val(article.category_parent_id);
      loadChildCategory(article.category_parent_id, article.category_id);
    } else {
      $('#root_cat').val(article.category_id);
    }
    $.get('/article/id/'+article.id+'/body', function(body) {
      CKEDITOR.instances['post-editor'].setData(body);
    });
  }
}

function enterPost() {
  familyCall(function(isLogin, family) {
    if (isLogin) {
      $.getJSON('/category/family/'+family.id+'/root', function(roots) {
        showPostContent(family, roots, null);
      });
    }
  });
}

function loadChildCategory(root_id, child_id) {
  if (root_id == null)  return false;
  $.getJSON('/category/'+root_id+'/children', function(categories) {
    var content = '<option value="-1">根</optioni>';
    $.each(categories, function() {
      content += '<option value="' + this.id + '">' + this.name + '</option>';
    });
    $('#child_cat').html(content);
    if (child_id != null)
      $('#child_cat').val(child_id);
  });
}

function publishArticle() {
  familyCall(function(isLogin, family) {
    if (isLogin) {
      if ($('#title').val() == '') {
        alert('标题不能为空');
        return false;
      }
      var editor = $('#post-editor');
      if (editor.val() == '') {
        alert('内容不能为空');
        return false;
      }
      editor.val(CKEDITOR.instances['post-editor'].getData());
      var root_cat = $('#root_cat').val();
      var child_cat = $('#child_cat').val();
      $('#category_id').val(root_cat);
      if (child_cat != -1) {
        $('#category_id').val(child_cat);
      }
      $.ajax({
        url: '/article/add',
        type: 'POST',
        data: $('#article_form').serialize(),
        success: function(message) {
          var message = $.parseJSON(message);
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
      showBox({name:'post-box'});
    }
  });
}

function closePost() {
  closeBox({name:'post-box'});
}

function editPost(id) {
  familyCall(function(isLogin, family) {
    if (isLogin) {
      $.getJSON('/category/family/'+family.id+'/root', function(roots) {
        $.getJSON('/article/id/'+id+'/parameter', function(article) {
          showPostContent(family, roots, article);
        });
      });
    }
  });
}

function editArticle(id) {
  familyCall(function(isLogin, family) {
    if (isLogin) {
      if ($('#title').val() == '') {
        alert('标题不能为空');
        return false;
      }
      var editor = $('#post-editor');
      if (editor.val() == '') {
        alert('内容不能为空');
        return false;
      }
      editor.val(CKEDITOR.instances['post-editor'].getData());
      var root_cat = $('#root_cat').val();
      var child_cat = $('#child_cat').val();
      $('#category_id').val(root_cat);
      if (child_cat != -1) {
        $('#category_id').val(child_cat);
      }
      $.ajax({
        url: '/article/'+id+'/edit',
        type: 'POST',
        data: $('#article_form').serialize(),
        success: function(message) {
          var message = $.parseJSON(message);
          if (message.success == 'true') {
            alert('修改完成');
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
      alert('进家后，才能修改');
    }
  });
}

function deletePost(id) {
  familyCall(function(isLogin, family) {
    if (isLogin) {
      var a = confirm('删除吗？');
      if (a) {
        $.ajax({
          url: '/article/'+id+'/delete',
          type: 'GET',
          success: function(message) {
            var message = $.parseJSON(message);
            if (message.success == 'true') {
              init();
              alert('已删除');
            } else {
              alert('Error: ' + message.msg);
              return false;
            }
          },
          error: function(message) {
            alert('Server Error:' + message);
          }
        });

      }
    }
  });
}

function showAddFamily() {
  familyCall(function(isLogin, family) {
    if (isLogin) {
      showBox({name:'family-box', focus:'a_family_name', title_name:'family_title', title_value:'添加家庭成员'});
    }
  });
}

function closeFamily() {
  closeBox({name:'family-box', message:'a_family_message'});
}

function addFamily() {
  var a = confirm('确认添加吗？');
  if (!a) {
    return false;
  }
  if ($('#a_family_name').val() == ''&& $('#a_family_name').val() == '') {
    $('#a_family_message').html('名字不能为空');
    return false;
  }

  if ($('#a_family_username').val() == ''&& $('#a_family_username').val() == '') {
    $('#a_family_message').html('登陆名不能为空');
    return false;
  }
  if ($('#a_family_password').val() != '' && $('#a_family_password').val() != $('#a_family_repassword').val()) {
    $('#a_family_message').html('钥匙不符合要求');
    return false;
  }
  $.ajax({
    url: '/family/add',
    type: 'POST',
    data: $('#familyform').serialize(),
    success: function(message) {
      var message = $.parseJSON(message);
      if (message.success == 'true') {
        listFamily(true);
        alert('成功添加');
      } else {
        var msg = message.msg;
        if (msg == -2)
          $('#a_family_message').html('不是家庭管理员');
        if (msg == -11)
          $('#a_family_message').html('家庭成员已存在');
        return false;
      }
    },
    error: function(message) {
      $('#a_family_message').html(message);
    }
  });
}

function deleteFamily(id) {
  familyCall(function(isLogin, family) {
    if (isLogin) {
      var a = confirm('删除吗？');
      if (a) {
        $.ajax({
          url: '/family/'+id+'/delete',
          type: 'GET',
          success: function(message) {
            var message = $.parseJSON(message);
            if (message.success == 'true') {
              listFamily(true);
              alert('已删除');
            } else {
              var msg_info = '不能删除';
              if (message.msg == 11)
                msg_info += '存在管理的文章';
              if (message.msg == 12)
                msg_info += '存在管理的目录';
              alert('Error: ' + msg_info);
              return false;
            }
          },
          error: function(message) {
            alert('Server Error:' + message);
          }
        });
      }
    }
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
  showToolbar();
});

function showToolbar() {
  $('#tb-about').remove();
  familyCall(function(isLogin, family) {
    if (isLogin) {
      if (family.id == 1) {
        var ahtml = '<a id="tb-about" onclick="editAbout()"><i class="icon-home"></i></a>';
        $('#toolbar-options').append(ahtml);
      }

      $('#btn-options').toolbar({
        content: '#toolbar-options',
        position: 'left-top',
        hideOnClick: true
      });
    }
  });
}

CKEDITOR.disableAutoInline = true;

function showBox(box) {
  var box_name = box.name;
  var focus_name = box.focus;
  var title_name = box.title_name;
  var title_value = box.title_value;
  if (title_name != null && title_value != null)
    $('#'+title_name).html(title_value);
  var box_dia = $('#' + box_name);
  box_dia.fadeIn(300);
  var popMargTop = (box_dia.height() + 24) / 2;
  var popMargLeft = (box_dia.width() + 24) / 2;
  box_dia.css({
    'margin-top' : -popMargTop,
    'margin-left' : -popMargLeft
  });
  $('body').append('<div id="mask"></div>');
  $('#mask').fadeIn(300);
  if (focus_name != null)
    $('#'+focus_name).focus();
}

function closeBox(box) {
  var box_name = box.name;
  var message_name = box.message;
  var box_dia = $('#' + box_name);
  if (message_name != null)
    $('#'+message_name).html('');
  box_dia.fadeOut(300 , function() {
    $('#mask').remove();
  });
}

