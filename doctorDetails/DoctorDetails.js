$(function () {
    var doctorId = window.location.href.split("?")[1];
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
                myLocal.setItem("doctorDetails", data.result);// 医生信息
                $(".doctorName").html(data.result.doctorName);// 姓名
                $(".titleName").html(data.result.titleName);//职称
                $(".hospitalName").html(data.result.hospitalName);//医院名
                $(".goodAt").html(data.result.doctorStrong);//擅长
                if (data.result.doctorStrong.length < 50) {
                    $(".goodAtFoldBtn").hide();
                }
                $(".resume").html(data.result.doctorResume);//简介
                if (data.result.doctorResume.length < 50) {
                    $(".resumeFoldBtn").hide();
                }
                $(".fansCount").html(data.result.fansCount);//关注量
                $(".hitsCount").html(data.result.hitsCount);//点击量
                $(".patientCount").html(data.result.patientCount);// 帮助患者量
                $(".focusBtn").attr("name", data.result.id)// id
                $(".hearImg").attr("src", data.result.headImg)// 头像
                if (data.result.areFans) {
                    // 已关注
                    $(".focusBtn").addClass("focusTrue").html("已关注");
                } else {
                    // 未关注
                    $(".focusBtn").removeClass("focusTrue").html("关注");
                }
            } else {
                layer.msg("信息加载失败")
            }
        },
        error: function (err) {
            console.log(err);
        },
    })
    $.ajax({
        headers: {
            Accept: "application/json; charset=utf-8",
            token: myLocal.getItem("token"),
        },
        type: 'GET',
        url: IP + '/api-goods/goods/inquiry/queryListByDoctor?doctorId=' + doctorId,
        xhrFields: {
            withCredentials: true,
        },
        dataType: 'json',
        success: function (data) {
            console.log(data)
            if (data.code == 20000) {
                var tempArr = data.result;
                for (var i = 0; i < tempArr.length; i++) {
                    if (tempArr[i].goodsType == "GOODS_INQUIRY_PICTURE") {
                        $(".imgPic").html(tempArr[i].goodsPrice + '/次');
                        $(".imgBtn").attr("name", tempArr[i].id);
                        $(".imgBtn").attr("data", JSON.stringify(tempArr[i]));
                        $(".imgBtn").attr("pic", tempArr[i].goodsPrice);
                    } else if (tempArr[i].goodsType == "GOODS_INQUIRY_PHONE") {
                        $(".telPic").html(tempArr[i].goodsPrice + '/次');
                        $(".telBtn").attr("name", tempArr[i].id);
                        $(".telBtn").attr("data", JSON.stringify(tempArr[i]));
                        $(".telBtn").attr("pic", tempArr[i].goodsPrice);
                    } else if (tempArr[i].goodsType == "GOODS_INQUIRY_VIDEO") {
                        $(".videoPic").html(tempArr[i].goodsPrice + '/次');
                        $(".videoBtn").attr("name", tempArr[i].id);
                        $(".videoBtn").attr("data", JSON.stringify(tempArr[i]));
                        $(".videoBtn").attr("pic", tempArr[i].goodsPrice);
                    }
                }
            } else {

            }
        },
        error: function (err) {
            console.log(err);
        },
    })
    // 折叠 - start
    $(".foldBtn").click(function () {
        $(this).toggleClass("foldTrue");
        $(this).siblings(".value").toggleClass("foldText");
    })
    // 折叠 - end

    // 加关注 、 取消关注  -  start
    $(".focusBtn").click(function () {
        if ($(this).hasClass("focusTrue")) {
            // 已关注 发 取消关注
            $.ajax({
                headers: {
                    Accept: "application/json; charset=utf-8",
                    token: myLocal.getItem("token"),
                },
                type: 'POST',
                url: IP + '/api-user/fansStar/unFocus',
                xhrFields: {
                    withCredentials: true,
                },
                data: {
                    "doctorId": $(this).attr("name"),
                },
                dataType: 'json',
                success: function (data) {
                    console.log(data)
                    if (data.code == 20000) {
                        layer.msg("取消关注成功")
                        $(".focusBtn").removeClass("focusTrue").html("关注");
                    } else {
                        layer.msg("取消关注失败")
                    }
                },
                error: function (err) {
                    console.log(err);
                },
            })
        } else {
            $.ajax({
                headers: {
                    Accept: "application/json; charset=utf-8",
                    token: myLocal.getItem("token"),
                },
                type: 'POST',
                url: IP + '/api-user/fansStar/focus',
                xhrFields: {
                    withCredentials: true,
                },
                data: {
                    "doctorId": $(this).attr("name"),
                },
                dataType: 'json',
                success: function (data) {
                    console.log(data)
                    if (data.code == 20000) {
                        layer.msg("关注成功")
                        $(".focusBtn").addClass("focusTrue").html("已关注");
                    } else {
                        layer.msg("关注失败")
                    }
                },
                error: function (err) {
                    console.log(err);
                },
            })
        }
    })
    // 加关注 、 取消关注  -  end

    $(".imgBtn").click(function () {
        if ($(".imgBtn").attr("pic")) {
            $(".imgPicAffirm").html($(".imgBtn").attr("pic"));
            layer.open({
                title: '',
                type: 1,
                content: $('.inquiryContianer'),
                closeBtn: false,
                shadeClose: false,
            });
        }
    })
    $('.inquiryContianer').find(".inquiryNoBtn").click(function () {
        layer.closeAll();
        $('.inquiryContianer').hide();
    })
    $('.inquiryContianer').find(".inquiryYesBtn").click(function () {
        // 存服务类型id
        myLocal.setItem("goodsInfo", JSON.parse($(".imgBtn").attr("data")))
        window.location = "/chestnut/imgCounsel/ImgCounsel.html";
    })

})