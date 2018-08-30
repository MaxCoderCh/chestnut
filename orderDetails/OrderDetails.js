$(function () {

    // 获取订单详情
    var orderId = window.location.href.split("?")[1];
    var imgUrls = [];
    $.ajax({
        headers: {
            token:myLocal.getItem("token"),
        },
        type: 'POST',
        url: IP + '/api-order/order/inquiry/getOrder',
        data: {
            "orderId": orderId,
        },
        dataType: 'json',
        success: function (data) {
            console.log(data)
            if (data.code == '20000') {
                $(".orderPrice").html(data.result.orderPrice);// 价格
                $(".orderDescription").html(data.result.orderDescription);// 问题描述
                // 咨询类型
                switch (data.result.orderType) {
                    case "PICTURE_INQUIRY_TYPE":
                        $(".consultType").html("图文咨询")
                        break;
                }
                var doctorId = data.result.doctor;
                // 获取医生信息
                $.ajax({
                    headers: {
                        Accept: "application/json; charset=utf-8",
                        token: myLocal.getItem("token"),
                    },
                    type: 'GET',
                    url: IP + '/api-user/doctor/detail/getDoctorDetailById?doctorId=' + doctorId,
                    xhrFields: {
                        withCredentials: true,
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        if (data.code == 20000) {
                            $(".doctorName").html(data.result.doctorName);// 医生名
                            $(".titleName").html(data.result.titleName);// 职称
                            $(".hospitalName").html(data.result.hospitalName);// 医院名
                            $(".goodAtValue").html(data.result.doctorStrong);// 擅长
                        } else {
                            layer.msg("信息加载失败");
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                })
                // 获取患者信息
                var patientId = data.result.patient;
                $.ajax({
                    headers: {
                        Accept: "application/json; charset=utf-8",
                        token: myLocal.getItem("token"),
                    },
                    type: 'GET',
                    url: IP + '/api-record/patient/getBaseInfoById?patientId=' + patientId,
                    xhrFields: {
                        withCredentials: true,
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        if (data.code == 20000) {
                            $(".patientName").html(data.result.patientName);// 患者名
                        } else {
                            layer.msg("信息加载失败");
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                })
                // 获取图片信息
                var patientArchive = data.result.patientArchive;
                $.ajax({
                    headers: {
                        Accept: "application/json; charset=utf-8",
                        token: myLocal.getItem("token"),
                    },
                    type: 'GET',
                    url: IP + '/api-archive/medical/report/getByGroupNumber?groupNumber=' + patientArchive,
                    xhrFields: {
                        withCredentials: true,
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        if (data.code == 20000) {
                            imgUrls = data.result;
                            var _html = '';
                            for (var i = 0; i < imgUrls.length; i++) {
                                _html += '<li class="imgItem" url="' + imgUrls[i] + '">\
                                <img class="photo" src="'+ imgUrls[i] + '" alt="">\
                            </li>'
                            }
                            $(".imgList").html(_html);
                        } else {
                            layer.msg("信息加载失败");
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                })
                // 查医生回复 - start
                $.ajax({
                    headers: {
                        Accept: "application/json; charset=utf-8",
                        token: myLocal.getItem("token"),
                    },
                    type: 'GET',
                    url: IP + '/api-assessmen/record/inquiry/getByArchive?archive=' + patientArchive,
                    xhrFields: {
                        withCredentials: true,
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        if (data.code == 20000) {
                            $(".adviceContent").show();
                            $(".adviceValue").html(data.result.inquiryAnswer)
                        } else {
                            $(".adviceContent").hide();
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                })
                // 查医生回复 - end
            } else {
                layer.msg("信息加载失败");
            }
        },
        error: function (err) {
            console.log(err)
        },
    });



    // 查看大图
    $(".imgList").delegate(".imgItem", "click", function () {
        wx.previewImage({
            current: $(this).attr('url'), // 当前显示图片的http链接
            urls: imgUrls, // 需要预览的图片http链接列表
        });
    })
})