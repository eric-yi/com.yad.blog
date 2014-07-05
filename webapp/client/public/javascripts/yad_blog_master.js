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
      showLogin();
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
        if (msg == -11)
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
  content += '<input type="hidden" id="summary" name="summary" value="" />';
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

function selectSummary(editor) {
  var data='';
  var mySelection = editor.getSelection();
  if (CKEDITOR.env.ie) {
    mySelection.unlock(true);
    data = mySelection.getNative().createRange().text;
  } else {
    data = mySelection.getNative();
  }

  return data;
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
      var summary = selectSummary(CKEDITOR.instances['post-editor']);
      $('#summary').val(summary);
      if ($('#summary').val() == '') {
        alert('必须选择概要部分');
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
              if (message.msg == -11)
                msg_info += '存在管理的文章';
              if (message.msg == -12)
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

function showAddCategory(id) {
  familyCall(function(isLogin, family) {
    if (isLogin) {
      $('#a_category_id').val(id);
      showBox({name:'add-category-box', focus:'a_category_name', title_name:'a_category_title', title_value:'添加分类目录'});
    }
  });
}

function closeAddCategory() {
  closeBox({name:'add-category-box', message:'a_category_message'});
}

function addCategory() {
  familyCall(function(isLogin, family) {
    var a = confirm('确认添加吗？');
    if (!a) {
      return false;
    }
    if ($('#a_category_name').val() == '' && $('#a_category_name').val() == '') {
      $('#a_category_message').html('名称不能为空');
      return false;
    }

    if ($('#a_category_path').val() == '' && $('#a_category_path').val() == '') {
      $('#a_category_message').html('路径不能为空');
      return false;
    }
    $.ajax({
      url: '/category/add',
      type: 'POST',
      data: $('#addcategoryform').serialize(),
      success: function(message) {
        var message = $.parseJSON(message);
        if (message.success == 'true') {
          listCategory(family);
          alert('成功添加');
        } else {
          var msg = message.msg;
          if (msg == -11)
            $('#a_category_message').html('分类目录已存在');
          return false;
        }
      },
      error: function(message) {
        $('#a_category_message').html(message);
      }
    });
  });
}

function showEditCategory(id, name) {
  familyCall(function(isLogin, family) {
    if (isLogin) {
      $.getJSON('/category/'+id+'/families', function(auths) {
        $.getJSON('/family', function(families) {
          $('#e_category_id').val(id);
          showBox({name:'edit-category-box', focus:'e_category_name', title_name:'e_category_title', title_value:'编辑分类目录'});
          $('#e_category_name').val(name);
          var members_html = '';
          $.each(families, function() {
            var checked = false;
            for (var n = 0; n < auths.length; n++) {
              if (Number(auths[n].id) == Number(this.id)) {
                checked = true;
                break;
              }
            }
            members_html += '<label><input type="checkbox" name="e_category_family" value="' + this.id + '"';
            if (checked) members_html += ' checked';
            members_html += ' />' + this.name + '</label>';
          });
          $('#e_category_members').html(members_html);
        });
      });
    }
  });
}

function closeEditCategory() {
  closeBox({name:'edit-category-box', message:'e_category_message'});
}

function editCategory() {
  familyCall(function(isLogin, family) {
    var a = confirm('确认修改吗？');
    if (!a) {
      return false;
    }
    var category_id = $('#e_category_id').val();
    if ($('#e_category_name').val() == '' && $('#e_category_name').val() == '') {
      $('#e_category_message').html('名称不能为空');
      return false;
    }
    $.ajax({
      url: '/category/'+category_id+'/edit',
      type: 'POST',
      data: $('#editcategoryform').serialize(),
      success: function(message) {
        var message = $.parseJSON(message);
        if (message.success == 'true') {
          listCategory(family);
          init();
          alert('修改完成');
        } else {
          var msg = message.msg;
          if (msg == -11)
            $('#e_category_message').html('名称已存在');
          return false;
        }
      },
      error: function(message) {
        $('#e_category_message').html(message);
      }
    });
  });
}

function deleteCategory(id) {
  familyCall(function(isLogin, family) {
    if (isLogin) {
      var a = confirm('删除吗？');
      if (a) {
        $.ajax({
          url: '/category/'+id+'/delete',
          type: 'GET',
          success: function(message) {
            var message = $.parseJSON(message);
            if (message.success == 'true') {
              listCategory(family);
              alert('已删除');
            } else {
              var msg_info = '不能删除';
              if (Number(message.msg) == -11)
                msg_info += ', 存在管理的文章';
              if (Number(message.msg) == -12)
                msg_info += ', 存在管理的目录';
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

function showAddLink() {
  familyCall(function(isLogin, family) {
    if (isLogin) {
      showBox({name:'link-box', focus:'a_link_name', title_name:'link_title', title_value:'添加友情链接'});
    }
  });
}

function closeLink() {
  closeBox({name:'link-box', message:'a_link_message'});
}

function addLink() {
  var a = confirm('确认添加吗？');
  if (!a) {
    return false;
  }
  if ($('#a_link_name').val() == '' && $('#a_link_name').val() == '') {
    $('#a_link_message').html('名称不能为空');
    return false;
  }

  if ($('#a_link_url').val() == '' && $('#a_link_url').val() == '') {
    $('#a_link_message').html('地址不能为空');
    return false;
  }
  $.ajax({
    url: '/link/add',
    type: 'POST',
    data: $('#linkform').serialize(),
    success: function(message) {
      var message = $.parseJSON(message);
      if (message.success == 'true') {
        listLink(true);
        alert('成功添加');
      } else {
        var msg = message.msg;
        if (msg == -11)
          $('#a_link_message').html('友情链接已存在');
        return false;
      }
    },
    error: function(message) {
      $('#a_link_message').html(message);
    }
  });
}

function deleteLink(id) {
  familyCall(function(isLogin, family) {
    if (isLogin) {
      var a = confirm('删除吗？');
      if (a) {
        $.ajax({
          url: '/link/'+id+'/delete',
          type: 'GET',
          success: function(message) {
            var message = $.parseJSON(message);
            if (message.success == 'true') {
              listLink(true);
              alert('已删除');
            } else {
              var msg_info = '不能删除';
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

function adminAbout() {
  $('#storyop').html('');
  familyCall(function(isLogin, family) {
    if (isLogin && family.id == 1) {
      var ahtml = '<a href="javascript:showEditAbout();"><i class="icon-edit"></i></a>';
      $('#storyop').append(ahtml);
    }
  });
}

var aboutContent = '';
function showEditAbout() {
  familyCall(function(isLogin, family) {
    if (isLogin && family.id == 1) {
      $.get('/about/content', function(data) {
        aboutContent = data;
        var content = '<textarea id="about-editor" name="about-editor">';
        content += '</textarea>';
        content += '<p align="right">';
        content += '<button type="button" onclick="javascript:setAboutContent();">重 置</button>';
        content += '<button type="button" onclick="javascript:editAbout();">确 认</button>';
        content += '</p>';

        $('#content').html(content);
        $('#about-editor').ckeditor();
        setAboutContent(data);
      });
    }
  });
}

function setAboutContent(data) {
  if (!data)
    data = aboutContent;
  CKEDITOR.instances['about-editor'].setData(data);
}

function editAbout() {
  familyCall(function(isLogin, family) {
    if (isLogin && family.id == 1) {
      var editor = $('#about-editor');
      if (editor.val() == '') {
        alert('内容不能为空');
        return false;
      }
      var a_data = CKEDITOR.instances['about-editor'].getData();
      $.ajax({
        url: '/about/edit',
        type: 'POST',
        data: {content:a_data},
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

