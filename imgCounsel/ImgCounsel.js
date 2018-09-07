$(function () {
    var goodsInfo = myLocal.getItem("goodsInfo");
    if (myLocal.getItem("patientInfo")) {
        var patientInfo = myLocal.getItem("patientInfo");
        myLocal.deleteItem("patientInfo");
        $(".selectBtnText").html(patientInfo.patientName ? patientInfo.patientName : '点击选择就诊人');
    }


    // 获取医生信息 - start
    var doctorDetails = myLocal.getItem("doctorDetails");
    $(".doctorName").html(doctorDetails.doctorName);// 姓名
    $(".titleName").html(doctorDetails.titleName);// 职称名
    $(".hospitalName").html(doctorDetails.hospitalName);// 医院名
    $(".goodAtValue").html(doctorDetails.doctorStrong);// 擅长
    $(".hearImg").attr("src", doctorDetails.headImg ? doctorDetails.headImg : "../images/defaultHear.png");// 头像
    // 获取医生信息 - end

    // 选择患者-start
    $(".selectBtn").click(function () {
        window.location = '/chestnut/selectPatients/SelectPatients.html';
    })
    // 选择患者-end


    var fileAllArr = [];
    var imgUrlArr = [];
    // 文件 处理 - start
    $(".fileInput").change(function () {
        var newFileArr = [];
        var uploadFile = $(this)[0].files; // 某一块添加时的原始数据
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
    // 预览图片
    $(".imgList").delegate(".imgItem", "click", function () {
        var urls = [];
        for (var i = 0; i < $(".imgList .imgItem").length; i++) {
            urls.push($(".imgList .imgItem").eq(i).attr("url"))
        }
        wx.previewImage({
            current: $(this).attr('url'), // 当前显示图片的http链接
            urls: urls, // 需要预览的图片http链接列表
        });
    })
    // 删除图片
    $(".imgList").delegate(".deleteImg", 'click', function () {
        var _thisObj = $(this);
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
                    layer.msg('发送失败');
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
        return false;
    })
    // 文件 处理 - start

    // 订单发送事件 - start
    $(".submitBtn").click(function () {
        if (!$(".orderDescription").val()) {
            layer.msg("请输入问题描述")
        } else if (imgUrlArr.length <= 0) {
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
                    "imgUrlArr": imgUrlArr.join(','),
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
                            url: IP + '/api-order/order/inquiry/createOrder',
                            xhrFields: {
                                withCredentials: true,
                            },
                            crossDomain: true,
                            data: {
                                "doctorId": doctorDetails.id,
                                "patientId": patientInfo.id,
                                "goodsId": goodsInfo.id,
                                "orderPrice": goodsInfo.goodsPrice,
                                "orderDescription": $(".orderDescription").val(),
                                "patientArchive": patientArchive,
                            },
                            dataType: 'json',
                            success: function (data) {
                                console.log(data)
                                if (data.code == 20000) {
                                    layer.msg('发送成功');
                                    setTimeout(function () {
                                        window.location = '/chestnut/weChatPay/WeChatPay.html?' + data.result;
                                    }, 1500)
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
    // 订单发送事件 - end
})