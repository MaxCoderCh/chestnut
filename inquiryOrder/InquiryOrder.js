$(function () {
    var pageNo = 1;
    var pageSize = 10;
    var dataFlag = true;
    // 顶部tab切换-start
    $(".navContent > a").click(function () {
        var _index = $(this).index();
        $(this).addClass('active').siblings('a').removeClass('active');
        $(".inquiryOrderList").html("");
        pageNo = 1;
        findDoctorList(_index, pageNo, pageSize);
    })
    // 顶部tab切换-end

    findDoctorList(0, pageNo, pageSize);
    function findDoctorList(_index, pageNo, pageSize) {
        var httpUrl = [
            IP + "/api-order/order/inquiry/getPayOrderList?pageNo=" + pageNo + "&pageSize=" + pageSize,// 待支付
            IP + "/api-order/order/inquiry/getProgressOrderList?pageNo=" + pageNo + "&pageSize=" + pageSize,// 进行中
            IP + "/api-order/order/inquiry/getDoneOrderList?pageNo=" + pageNo + "&pageSize=" + pageSize,// 已完成
        ];

        $.ajax({
            headers: {
                Accept: "application/json; charset=utf-8",
                token: myLocal.getItem("token"),
            },
            type: 'GET',
            url: httpUrl[_index],
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
                        _html += '<div class="orderItem" orderType="' + tempArr[i].orderStatus + '" name="' + tempArr[i].id + '">\
                        <div class="topBox">\
                            <p class="baseInfo">'+ tempArr[i].patientName + " " + tempArr[i].patientSex + " " + tempArr[i].patientAge + '岁' + '</p>'
                        if (tempArr[i].orderStatus == 'TO_BE_PAYMENT') {
                            _html += '<a class="btn compileBtn" href="javascript:;">\
                            <img src="../images/compileBtn.png" alt="">编辑</a>\
                        <a class="btn deleteBtn" href="javascript:;">\
                            <img src="../images/deleteBtn.png" alt="">删除</a>'
                        }
                        _html += '</div>\
                        <div class="illnessBox">\
                            <p class="illnessDesc">'+ tempArr[i].orderDescription + '</p>\
                        </div>\
                    </div>';
                    }
                    $(".inquiryOrderList").append(_html);
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
    $(".inquiryOrderList").delegate(".orderItem", "click", function () {
        if ($(this).attr("orderType") == "TO_BE_PAYMENT") {
            myLocal.setItem("orderId", $(this).attr("name"));
            window.location = "/chestnut/orderCompile/OrderCompile.html";
        } else {
            window.location = "/chestnut/orderDetails/OrderDetails.html?" + $(this).attr("name");
        }
    })
    // 编辑
    $(".inquiryOrderList").delegate(".compileBtn", "click", function () {
        myLocal.setItem("orderId", $(this).parents(".orderItem").attr("name"));
        window.location = "/chestnut/orderCompile/OrderCompile.html";
        return false;
    })
    // 删除
    var deleteObj = null;
    var deleteId = '';
    $(".inquiryOrderList").delegate(".deleteBtn", "click", function () {
        layer.open({
            title: '',
            type: 1,
            content: $('.confirmContent'),
            closeBtn: false,
            shadeClose: false,
        });
        deleteObj = $(this).parents(".orderItem");
        deleteId = $(this).parents(".orderItem").attr("name");
        return false;
    })
    $(".confirmContent").find(".noBtn").click(function () {
        layer.closeAll();
        $('.confirmContent').hide();
    })
    $(".confirmContent").find(".yesBtn").click(function () {
        $.ajax({
            headers: {
                token:myLocal.getItem("token"),
            },
            type: 'POST',
            url: IP + '/api-order/order/inquiry/removeOrder',
            data: {
                "orderId": deleteId,
            },
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.code == '20000') {
                    deleteObj.remove();
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
    // 加载更多 - start
    $(window).scroll(function () {
        if (dataFlag && $(window).scrollTop() + $(window).height() >= $(document).height() - 30) {
            pageNo = pageNo * 1 + 1;
            findDoctorList($(".navContent > a.active").index(), pageNo, pageSize);
        }
    })
    // 加载更多 - end


})