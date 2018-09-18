$(function () {
    var tempHref = '';
    // 获取token
    function getToken() {
        $('form')[0].submit();
        var codeStr = window.location.href.split('?')[1].split('=')[1].split('&')[0];
        $.ajax({
            type: 'POST',
            url: IP + '/api-user/weChat/oauth',
            dataType: 'json',
            data: {
                "code": codeStr,
            },
            async: false,
            success: function (data) {
                console.log(data)
                if (data.code == '20000') {
                    myLocal.setItem('token', data.result);
                    if (tempHref) {
                        window.location = tempHref;
                    } else {
                        window.location.reload();
                    }
                } else {
                    getToken();
                }
            },
            error: function (err) {
                console.log(err)
            },
        });
    }

    // 获取用户信息
    $.ajax({
        headers: {
            token: myLocal.getItem("token"),
        },
        type: 'GET',
        url: IP + '/api-record/patientAnamnesis/selete',
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log(data)
            if (data.code == '20000') {
                myLocal.setItem('userInfo', data.result);
            } else if (data.code == '40001') {
                if (window.location.pathname == "/chestnut/doctorDetails/DoctorDetails.html") {
                    tempHref = window.location.href;
                }
                getToken();
            } else if (data.code == '40004') {
                myLocal.deleteItem('userInfo')
            }
        },
        error: function (err) {
            layer.msg('服务器维护中...')
            console.log(err)
        },
    });
})