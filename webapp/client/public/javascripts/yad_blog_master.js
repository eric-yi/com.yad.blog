function showLogin() {
  $.getJSON('/family/current', function(family) {
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

function familyCall(callback) {
  var isLogin = false;
  $.getJSON('/family/current', function(family) {
    if (family.id != null)
      isLogin = true;
    callback(isLogin, family);
  });
}

function editInfo() {
	familyCall(function(isLogin, family) {
		if (isLogin) {
			$('#family_name').val(family.name);
			if (family.email != 'undefined')
				$('#family_email').val(family.email);
			if (family.qq != 'undefined')
				$('#family_qq').val(family.qq);
			if (family.weibo != 'undefined')
				$('#family_weibo').val(family.weibo);
			if (family.weico != 'undefined')
				$('#family_weico').val(family.weico);
			showInfo();
		}
	});
}

function showInfo() {
  $('#info-box').fadeIn(300);
  var popMargTop = ($('#info-box').height() + 24) / 2;
  var popMargLeft = ($('#info-box').width() + 24) / 2;
  $('#info-box').css({
    'margin-top' : -popMargTop,
    'margin-left' : -popMargLeft
  });
  $('body').append('<div id="mask"></div>');
  $('#mask').fadeIn(300);
  $('#family_name').focus();
}

function closeInfo() {
  $('#info-box').fadeOut(300 , function() {
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

