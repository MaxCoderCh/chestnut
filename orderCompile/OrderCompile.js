$(function () {
    // 获取订单详情-start
    var orderId = myLocal.getItem("orderId");
    var patientInfo = null;// 患者信息
    var doctorDetails = null;// 医生信息
    var orderInfo = null;// 订单信息
    $.ajax({
        headers: {
            token:myLocal.getItem("token"),
        },
        type: 'POST',
        url: IP + '/api-order/order/inquiry/getOrder',
        data: {
            "orderId": orderId,
        },
        async: false,
        dataType: 'json',
        success: function (data) {
            console.log(data)
            if (data.code == '20000') {
                orderInfo = data.result;
                $(".orderDescription").html(data.result.orderDescription);// 问题描述
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
                            doctorDetails = data.result;
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
                getBaseInfoById(patientId);
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
                            var imgUrls = data.result;
                            var _html = '';
                            for (var i = 0; i < imgUrls.length; i++) {
                                _html += '<li class="imgItem" url="' + imgUrls[i] + '">\
                                <img class="photo" src="'+ imgUrls[i] + '" alt="">\
                                <img class="deleteImg" src="../images/delete.png" alt="">\
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
            } else {
                layer.msg("信息加载失败");
            }
        },
        error: function (err) {
            console.log(err)
        },
    });
    // 获取订单详情-end
    // 获取患者信息
    function getBaseInfoById(patientId) {
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
                    patientInfo = data.result;
                    myLocal.setItem("patientInfo", data.result);
                    $(".selectBtnText").html(data.result.patientName);// 患者名
                } else {
                    layer.msg("信息加载失败");
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
    }
    getBaseInfoById(myLocal.getItem("patientInfo").id);

    // 选择患者
    $(".selectBtn").click(function () {
        window.location = '/chestnut/selectPatients/SelectPatients.html';
    })

    // 查看大图
    $(".imgList").delegate(".imgItem", "click", function () {
        var urls = [];
        for (var i = 0; i < $(".imgList .imgItem").legnth; i++) {
            urls.push($(".imgList .imgItem").eq(i).attr("url"))
        }
        wx.previewImage({
            current: $(this).attr('url'), // 当前显示图片的http链接
            urls: urls, // 需要预览的图片http链接列表
        });
    })

    var fileAllArr = [];
    var imgUrlArr = [];
    // 文件 处理 - start
    $(".fileInput").change(function () {
        var newFileArr = [];
        var uploadFile = $(this)[0].files; // 某一块添加时的原始数据
        var _html = '';
        var fileLength = 0;
        var reader = new FileReader();
        reader.readAsDataURL(uploadFile[fileLength]);
        reader.onload = function (e) {
            if (e.target.result) {
                // 过滤重复
                var flag = true;
                for (var i = 0; i < fileAllArr.length; i++) {
                    if (fileAllArr[i].name == uploadFile[fileLength].name) {
                        flag = false;
                    }
                }
                if (flag) {
                    if (/(.png|.jpg|.jpeg|.pdf)$/gi.test(uploadFile[fileLength].name)) {
                        fileAllArr.push({
                            "name": uploadFile[fileLength].name,
                            "value": uploadFile[fileLength],
                        });
                        newFileArr.push(uploadFile[fileLength]);
                    } else {
                        layer.msg('请上传png/jpg/jpeg类型的文件');
                    }
                } else {
                    // layer.msg('重复文件已过滤');
                }
                fileLength++;
                if (fileLength < uploadFile.length) {
                    reader.readAsDataURL(uploadFile[fileLength]);
                } else {
                    var postData = new FormData();
                    postData.append("recordType", "patient-record");
                    for (var i = 0; i < newFileArr.length; i++) {
                        postData.append("files", newFileArr[i]);
                    }
                    $.ajax({
                        headers: {
                            token: myLocal.getItem("token"),
                        },
                        type: 'POST',
                        url: IP + '/api-third/cos/uploads',
                        xhrFields: {
                            withCredentials: true,
                        },
                        crossDomain: true,
                        processData: false,
                        contentType: false,
                        data: postData,
                        dataType: 'json',
                        success: function (data) {
                            console.log(data)
                            if (data.code == 20000) {
                                var tempArr = data.result;
                                imgUrlArr = imgUrlArr.concat(tempArr);
                                var _html = '';
                                for (var i = 0; i < tempArr.length; i++) {
                                    _html += '<li class="imgItem" url="' + tempArr[i] + '">\
                                    <img class="photo" src="'+ tempArr[i] + '" alt="">\
                                    <img class="deleteImg" src="../images/delete.png" alt="">\
                                </li>'
                                };
                                $(".imgList").append(_html)
                            } else {

                            }
                        },
                        error: function (err) {
                            console.log(err);
                        },
                    })
                }
            }
        }
    })

    // 删除图片
    $(".imgList").delegate(".deleteImg", "click", function () {
        var _thisObj = $(this);
        try {
            $.ajax({
                headers: {
                    token: myLocal.getItem("token"),
                },
                type: 'POST',
                url: IP + '/api-third/cos/delete',
                xhrFields: {
                    withCredentials: true,
                },
                crossDomain: true,
                data: {
                    "imgPath": $(this).parents(".imgItem").attr("url"),
                },
                dataType: 'json',
                success: function (data) {
                    console.log(data)
                    if (data.code == 20000) {
                        _thisObj.parents('.imgItem').remove();
                    } else {
                        _thisObj.parents('.imgItem').remove();
                    }
                },
                error: function (err) {
                    console.log(err);
                },
            })
        } catch (error) {
            console.log(error)
        }
        return false;
    })


    // 订单修改事件 - start
    $(".submitBtn").click(function () {
        var tempImgUrls = [];
        for (var i = 0; i < $(".imgList .imgItem").length; i++) {
            tempImgUrls.push($(".imgList .imgItem").eq(i).attr("url"));
        }
        if (!$(".orderDescription").val()) {
            layer.msg("请输入问题描述")
        } else if (tempImgUrls.length <= 0) {
            layer.msg("请上传图片")
        } else {
            $.ajax({
                headers: {
                    token: myLocal.getItem("token"),
                },
                type: 'POST',
                url: IP + '/api-archive/medical/report/addInquiryReport',
                xhrFields: {
                    withCredentials: true,
                },
                crossDomain: true,
                data: {
                    "patientId": patientInfo.id,
                    "imgUrlArr": tempImgUrls.join(','),
                },
                dataType: 'json',
                success: function (data) {
                    console.log(data)
                    if (data.code == 20000) {
                        var patientArchive = data.result;
                        $.ajax({
                            headers: {
                                token: myLocal.getItem("token"),
                            },
                            type: 'POST',
                            url: IP + '/api-order/order/inquiry/updateOrder',
                            xhrFields: {
                                withCredentials: true,
                            },
                            crossDomain: true,
                            data: {
                                "orderId": orderId,
                                "doctorId": doctorDetails.id,
                                "patientId": patientInfo.id,
                                "goodsId": orderInfo.goods,
                                "orderPrice": orderInfo.orderPrice,
                                "orderDescription": $(".orderDescription").val(),
                                "patientArchive": patientArchive,
                            },
                            dataType: 'json',
                            success: function (data) {
                                console.log(data)
                                if (data.code == 20000) {
                                    window.location = '/chestnut/weChatPay/WeChatPay.html?' + data.result;
                                } else {
                                    layer.msg('发送失败');
                                }
                            },
                            error: function (err) {
                                console.log(err);
                            },
                        })
                    } else {
                        layer.msg('发送失败');
                    }
                },
                error: function (err) {
                    console.log(err);
                },
            })

        }
    })
    // 订单修改事件 - end
})