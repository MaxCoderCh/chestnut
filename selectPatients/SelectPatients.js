$(function () {
    var pageNo = 1;
    var pageSize = 10;
    var dataFlag = true;// 是否还有下一页
    getPatientList(pageNo, pageSize);
    function getPatientList(pageNo, pageSize) {
        $.ajax({
            headers: {
                Accept: "application/json; charset=utf-8",
                token: myLocal.getItem("token"),
            },
            type: 'GET',
            url: IP + '/api-record/userPatient/getPatientList?pageNo=' + pageNo + '&pageSize=' + pageSize,
            xhrFields: {
                withCredentials: true,
            },
            dataType: 'json',
            async: false,
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    $(".content").hide();
                    $(".peopleList").show();
                    $(".addPersonBtn").show();
                    var tempArr = data.result;
                    if (tempArr.length >= pageSize) {
                        dataFlag = true;
                    } else {
                        dataFlag = false;
                    }
                    var _html = '';
                    for (var i = 0; i < tempArr.length; i++) {
                        _html += "<div class='peopleItem' name='" + JSON.stringify(tempArr[i]) + "'>"
                        _html += '<div class="infoBox">\
                            <p>\
                                <span class="doctorName">'+ tempArr[i].patientName + '</span>\
                                <span class="relation">('+ tempArr[i].patientSource + ')</span>\
                            </p>\
                            <p>\
                                <span class="sex">'+ tempArr[i].patientSex + '</span>\
                                <span class="age">'+ tempArr[i].patientAge + '岁</span>\
                            </p>\
                        </div>\
                        <div class="btnBox">\
                            <a class="compileBtn" href="javascript:;">\
                                <img src="../images/compileBtn.png" alt="">编辑</a>\
                            <a class="deleteBtn" href="javascript:;">\
                                <img src="../images/deleteBtn.png" alt="">删除</a>\
                        </div>\
                    </div>'
                    }
                    $(".peopleList").append(_html)
                } else {
                    dataFlag = false;
                    if (pageNo == 1) {
                        $(".content").show();
                        $(".peopleList").hide();
                        $(".addPersonBtn").hide();
                    }
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
    }
    var patientInfo = {};// 当前操作的信息
    var obj = null;
    // 选择就诊人-start
    $(".peopleList").delegate(".peopleItem", "click", function () {
        patientInfo = eval("(" + $(this).attr("name") + ")");
        // 存储患者信息
        myLocal.setItem("patientInfo", patientInfo);
        window.location = '/chestnut/imgCounsel/ImgCounsel.html';
    })
    // 选择就诊人-end
    // 就诊人编辑事件 - start
    $(".peopleList").delegate('.compileBtn', 'click', function () {
        patientInfo = eval("(" + $(this).parents(".peopleItem").attr("name") + ")");
        myLocal.setItem("patientInfo", patientInfo);
        window.location = '/chestnut/addPeople/AddPeople.html';
        return false;
    })
    // 就诊人编辑事件 - end

    // 就诊人删除事件 - start
    $(".peopleList").delegate('.deleteBtn', 'click', function () {
        layer.open({
            title: '',
            type: 1,
            content: $('.confirmContent'),
            closeBtn: false,
            shadeClose: false,
        });
        obj = $(this).parents(".peopleItem");
        patientInfo = eval("(" + $(this).parents(".peopleItem").attr("name") + ")");
        $(".objName").html(patientInfo.patientName);
        return false;
    })
    $(".confirmContent").find(".noBtn").click(function () {
        layer.closeAll();
        $('.confirmContent').hide();
    })
    $(".confirmContent").find(".yesBtn").click(function () {
        $.ajax({
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'POST',
            url: IP + '/api-record/userPatient/remove',
            data: {
                "patientId": patientInfo.id,
            },
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.code == '20000') {
                    obj.remove();
                    layer.closeAll();
                    $(".confirmContent").hide();
                    layer.msg("删除成功")
                } else {
                    layer.closeAll();
                    $(".confirmContent").hide();
                    layer.msg("删除失败")
                }
            },
            error: function (err) {
                console.log(err)
            },
        });
    })
    // 就诊人删除事件 - end

    // 添加就诊人 按钮 - start
    $(".addPeopleBtn,.addPersonBtn").click(function () {
        myLocal.deleteItem("patientInfo");
        window.location = "/chestnut/addPeople/AddPeople.html";
    })
    // 添加就诊人 按钮 - end

    $(window).scroll(function () {
        if (dataFlag && $(".addPersonBtn").offset().top < $(window).scrollTop() + $(window).height()) {
            pageNo = pageNo * 1 + 1
            getPatientList(pageNo, pageSize);
        }
    })
})