$(function () {

    // 获取登录者 的微信基本信息
    var nickName = '';
    $.ajax({
        headers: {
            token: myLocal.getItem("token"),
        },
        type: 'GET',
        url: IP + '/api-user/weChat/getUserInfo',
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log(data)
            if (data.code == '20000') {
                $('.userImg').attr('src', data.result.headImgUrl);// 用户头像
                nickName = data.result.nickName;// 微信昵称
            } else if (data.code == '40001') {
                getToken();
            }
        },
        error: function (err) {
            console.log(err)
        },
    });

    // 姓名
    $('.username').html(myLocal.getItem('userInfo') && myLocal.getItem('userInfo').patientName ? myLocal.getItem('userInfo').patientName : nickName);
    // 档案号
    $('.account').html(myLocal.getItem('userInfo') && myLocal.getItem('userInfo').patientNumber ? '档案号：' + myLocal.getItem('userInfo').patientNumber : '');
})
