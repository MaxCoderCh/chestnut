$(function () {
    // 微信端获取医患关系绑定二维码
    $.ajax({
        headers: {
            token: myLocal.getItem("token"),
        },
        type: 'GET',
        url: IP + '/api-user/weChat/getQRCode',
        dataType: 'json',
        success: function (data) {
            console.log(data)
            if (data.code == '20000') {
                $('.qrcodeText').html('绑定码' + data.result);
                $('.qrcodeImg').qrcode({
                    render: 'canvas',
                    width: 200,
                    height: 200,
                    // foreground: "black",
                    // background: "#FFF",
                    text: data.result,
                });
            } else if (data.code == '40001') {
                getToken();
            } else {
                $('.qrcodeImg').qrcode({
                    render: 'canvas',
                    width: 200,
                    height: 200,
                    // foreground: "black",
                    // background: "#FFF",
                    text: '',
                });
            }
        },
        error: function (err) {
            console.log(err)
        },
    });

    setTimeout(function () {
        $('.refreshBtn').css({
            "display": "flex"
        });
    }, 300000)
    $('.refreshBtn').click(function () {
        $.ajax({
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'GET',
            url: IP + '/api-user/weChat/getQRCode',
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.code == '20000') {
                    $('.qrcodeImg').html('');
                    $('.qrcodeText').html('绑定码' + data.result);
                    $('.qrcodeImg').qrcode({
                        render: 'canvas',
                        width: 200,
                        height: 200,
                        // foreground: "black",
                        // background: "#FFF",
                        text: data.result,
                    });
                    $('.refreshBtn').css({
                        "display": "none"
                    });
                    setTimeout(function () {
                        $('.refreshBtn').css({
                            "display": "flex"
                        });
                    }, 300000)
                } else if (data.code == '40001') {
                    getToken();
                }
            },
            error: function (err) {
                console.log(err)
            },
        });
    })
    if (myLocal.getItem('userInfo') && myLocal.getItem('userInfo').patientName) {
        $('.name').html(myLocal.getItem('userInfo').patientName);
    } else {
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
                    $('.name').html(data.result.nickName);
                } else if (data.code == '40001') {
                    getToken();
                }
            },
            error: function (err) {
                console.log(err)
            },
        });
    }
    $('.tel').html(myLocal.getItem('userInfo') && myLocal.getItem('userInfo').patientPhone ? myLocal.getItem('userInfo').patientPhone : null);
})
