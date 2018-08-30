$(function () {
    // var pageNo = 1;
    // var pageSize = 10;
    // var dataFlag = true;// 是否还有下一页
    // findStar(pageNo, pageSize);
    // function findStar(pageNo, pageSize) {
    //     $.ajax({
    //         headers: {
    //             Accept: "application/json; charset=utf-8",
    //             token: "546eb86e866b11e8a09b68cc6e5c9c74"
    //         },
    //         type: 'GET',
    //         url: IP + '/api-user/doctor/detail/findStar?pageNo=' + pageNo + '&pageSize=' + pageSize,
    //         xhrFields: {
    //             withCredentials: true,
    //         },
    //         dataType: 'json',
    //         async: false,
    //         success: function (data) {
    //             console.log(data)
    //             if (data.code == 20000) {
    //                 $(".noDoctor").hide();
    //                 $(".doctorList").show();
    //                 var tempArr = data.result;
    //                 if (tempArr.length >= pageSize) {
    //                     dataFlag = true;
    //                 } else {
    //                     dataFlag = false;
    //                 }
    //             } else {
    //                 dataFlag = false;
    //                 if (pageNo == 1) {
    //                     $(".noDoctor").show();
    //                     $(".doctorList").hide();
    //                 }
    //             }
    //         },
    //         error: function (err) {
    //             console.log(err);
    //         },
    //     })
    // }
    // var userInfo = {};// 当前操作的信息
    // var obj = null;
    // // 就诊人编辑事件 - start
    // $(".peopleList").delegate('.compileBtn', 'click', function () {
    //     userInfo = eval("(" + $(this).parents(".peopleItem").attr("name") + ")");
    //     myLocal.setItem("userInfo", userInfo);
    //     window.location = '/chestnut/addPeople/AddPeople.html';
    // })
    // // 就诊人编辑事件 - end

    // // 就诊人删除事件 - start
    // $(".peopleList").delegate('.deleteBtn', 'click', function () {
    //     layer.open({
    //         title: '',
    //         type: 1,
    //         content: $('.confirmContent'),
    //         closeBtn: false,
    //         shadeClose: false,
    //     });
    //     obj = $(this).parents(".peopleItem");
    //     userInfo = eval("(" + $(this).parents(".peopleItem").attr("name") + ")");
    //     $(".objName").html(userInfo.patientName);
    // })
    // $(".confirmContent").find(".noBtn").click(function () {
    //     layer.closeAll();
    //     $('.confirmContent').hide();
    // })
    // $(".confirmContent").find(".yesBtn").click(function () {
    //     $.ajax({
    //         headers: {
    //             token:myLocal.getItem("token"),
    //         },
    //         type: 'POST',
    //         url: IP + '/api-record/userPatient/remove',
    //         data: {
    //             "patientId": userInfo.id,
    //         },
    //         dataType: 'json',
    //         success: function (data) {
    //             console.log(data)
    //             if (data.code == '20000') {
    //                 obj.remove();
    //                 layer.closeAll();
    //                 $(".confirmContent").hide();
    //                 layer.msg("删除成功")
    //             } else {
    //                 layer.closeAll();
    //                 $(".confirmContent").hide();
    //                 layer.msg("删除失败")
    //             }
    //         },
    //         error: function (err) {
    //             console.log(err)
    //         },
    //     });
    // })
    // // 就诊人删除事件 - end

    // 添加就诊人 按钮 - start
    // $(".addFoucsBtn").click(function () {
    //     window.location = "/chestnut/doctorSearch/DoctorSearch.html";
    // })
    // 添加就诊人 按钮 - end

    // $(window).scroll(function () {
    //     if (dataFlag && $(".addPersonBtn").offset().top < $(window).scrollTop() + $(window).height()) {
    //         getPatientList((pageNo * 1 + 1), pageSize);
    //     }
    // })
})