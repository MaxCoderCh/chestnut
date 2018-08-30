$(function () {
    var pageNo = 1;
    var pageSize = 10;
    var dataFlag = true;// 是否还有下一页
    findStar(pageNo, pageSize);
    function findStar(pageNo, pageSize) {
        $.ajax({
            headers: {
                Accept: "application/json; charset=utf-8",
                token: myLocal.getItem("token"),
            },
            type: 'GET',
            url: IP + '/api-user/doctor/detail/findStar?pageNo=' + pageNo + '&pageSize=' + pageSize,
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
                        </div>\
                        <a class="focusBtn focusYes" href="javascript:;">\
                            <img class="focusImg" src="../images/focusYes.png" alt="">已关注</a>\
                    </div>';
                    }
                    $(".doctorList").append(_html);
                } else {
                    dataFlag = false;
                    if (pageNo == 1) {
                        $(".noDoctor").show();
                        $(".doctorList").hide();
                    }
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
    }


    // 取消关注
    $(".doctorList").delegate(".focusYes", "click", function () {
        var obj = $(this).parents(".doctorItem");
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
                    obj.remove();
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
    $(".doctorList").delegate(".doctorItem", "click", function () {
        window.location = '/chestnut/doctorDetails/DoctorDetails.html?' + $(this).attr("name");
    })
    $(".addFoucsBtn").click(function () {
        window.location = '/chestnut/doctorSearch/DoctorSearch.html'
    })


    $(window).scroll(function () {
        if (dataFlag && $(window).scrollTop() + $(window).height() >= $(document).height() - 30) {
            pageNo = pageNo * 1 + 1;
            findStar(pageNo, pageSize);
        }
    })
})