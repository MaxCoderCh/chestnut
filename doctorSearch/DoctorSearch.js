$(function () {
    var pageSize = 10;
    var pageNo = 1;
    var dataFlag = true;
    $(document).keyup(function (event) {
        if (event.keyCode == 13) {
            pageNo = 1;
            $(".doctorList").html("");
            findDoctorList(pageNo, pageSize);
        }
    });
    findDoctorList(pageNo, pageSize);
    $(".searchBtn").click(function () {
        pageNo = 1;
        $(".doctorList").html("");
        findDoctorList(pageNo, pageSize);
    })
    function findDoctorList(pageNo, pageSize) {
        $.ajax({
            headers: {
                Accept: "application/json; charset=utf-8",
                token: myLocal.getItem("token"),
            },
            type: 'GET',
            url: IP + '/api-user/doctor/detail/findDoctorList?doctorName=' + $(".searchInput").val() + '&pageSize=' + pageSize + '&pageNo=' + pageNo,
            xhrFields: {
                withCredentials: true,
            },
            dataType: 'json',
            async: false,
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    $(".noDoctor").hide();
                    $(".doctorList").show();
                    var tempArr = data.result;
                    if (tempArr.length >= pageSize) {
                        dataFlag = true;
                    } else {
                        dataFlag = false;
                    }
                    var _html = '';
                    for (var i = 0; i < tempArr.length; i++) {
                        _html += '<div class="doctorItem" name="' + tempArr[i].id + '">\
                        <img class="hearImg" src="'+ (tempArr[i].headImg ? tempArr[i].headImg : "../images/defaultHear.png") + '" alt="默认头像">\
                        <div class="infoBox">\
                            <p class="doctorName">'+ tempArr[i].doctorName + '</p>\
                            <p class="titleName">'+ tempArr[i].titleName + '</p>\
                            <p class="hospotalName">'+ tempArr[i].hospitalName + '</p>\
                        </div>'
                        if (tempArr[i].areFans) {
                            _html += '<a class="focusBtn focusYes" href="javascript:;"><img class="focusImg" src="../images/focusYes.png" alt=""> 已关注</a></div>'
                        } else {
                            _html += '<a class="focusBtn focusNo" href="javascript:;"><img class="focusImg" src="../images/focusNo.png" alt=""> 未关注</a></div>'
                        }
                    }
                    $(".doctorList").append(_html);
                } else {
                    dataFlag = false;
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
    }
    // 查看详情
    $(".doctorList").delegate(".doctorItem", "click", function () {
        window.location = '/chestnut/doctorDetails/DoctorDetails.html?' + $(this).attr('name');
    })
    // 取消关注
    $(".doctorList").delegate(".focusYes", "click", function () {
        var _this = $(this);
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
                "doctorId": $(this).parents(".doctorItem").attr("name"),
            },
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    layer.msg("取消关注成功")
                    _this.removeClass("focusYes").addClass("focusNo").html('<img class="focusImg" src="../images/focusNo.png" alt=""> 未关注</a>');
                } else {
                    layer.msg("取消关注失败")
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
        return false;
    })
    // 加关注
    $(".doctorList").delegate(".focusNo", "click", function () {
        var _this = $(this);
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
                "doctorId": $(this).parents(".doctorItem").attr("name"),
            },
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    layer.msg("关注成功")
                    _this.removeClass("focusNo").addClass("focusYes").html('<img class="focusImg" src="../images/focusYes.png" alt=""> 已关注');
                } else {
                    layer.msg("关注失败")
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
        return false;
    })
    $(window).scroll(function () {
        if (dataFlag && $(window).scrollTop() + $(window).height() >= $(document).height() - 30) {
            pageNo = pageNo * 1 + 1;
            findDoctorList(pageNo, pageSize);
        }
    })
})