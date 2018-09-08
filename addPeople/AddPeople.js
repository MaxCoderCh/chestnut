$(function () {
    layui.use('form', function () {
        var form = layui.form;
        form.render();
    });
    var userInfo = null;
    var flag = true;// 是否是新建的
    if (!flag) {
        $(".fileBtn").click(function () {
            layer.msg("不能修改");
            return false;
        })
    }
    // 获取身份证图片路径 - start
    $(".fileBtn").change(function () {
        layer.open({
            title: '',
            type: 1,
            content: $('.loadingContainer'),
            closeBtn: false,
            shadeClose: false,
            skin: 'noBackground',
        });
        var postData = new FormData();
        postData.append("recordType", "person-card");
        postData.append("file", $(this)[0].files[0]);
        $.ajax({
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'POST',
            url: IP + '/api-third/cos/upload',
            xhrFields: {
                withCredentials: true,
            },
            processData: false,
            contentType: false,
            data: postData,
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    $.ajax({
                        headers: {
                            Accept: "application/json; charset=utf-8",
                            token: myLocal.getItem("token"),
                        },
                        type: 'POST',
                        url: IP + '/api-record/patient/add',
                        xhrFields: {
                            withCredentials: true,
                        },
                        data: {
                            "idCardUrl": data.result,
                        },
                        dataType: 'json',
                        success: function (data) {
                            console.log(data)
                            layer.closeAll();
                            $(".loadingContainer").hide();
                            if (data.code == 20000) {
                                userInfo = data.result;
                                $(".doctorName").html(data.result.patientName);
                                $(".sex").html(data.result.patientSex);
                                $(".age").html(data.result.patientAge + '岁');
                                $(".idNumber").html(data.result.patientCard);
                            } else if (data.code == '50000') {
                                layer.msg('图片上传失败');
                            } else {
                                layer.msg('图片上传失败');
                            }
                        },
                        error: function (err) {
                            console.log(err);
                        },
                    })
                } else {
                    layer.msg('图片上传失败');
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
    })


    // 获取身份证图片路径 - end
    if (myLocal.getItem('userInfo')) {
        $.ajax({
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'GET',
            url: IP + '/api-record/patientAnamnesis/getPatientById?patientId=' + myLocal.getItem("userInfo").id,
            dataType: 'json',
            async: false,
            success: function (data) {
                console.log(data)
                if (data.code == '20000') {
                    flag = false;
                    myLocal.setItem("userInfo", data.result);
                    userInfo = data.result;
                    $(".doctorName").html(data.result.patientName);
                    $(".sex").html(data.result.patientSex);
                    $(".age").html(data.result.patientAge + '岁');
                    $(".idNumber").html(data.result.patientCard);
                    $(".patientSource").val(data.result.patientSource);
                    layui.use('form', function () {
                        var form = layui.form;
                        form.render();
                    });
                } else if (data.code == '40004') {
                    myLocal.deleteItem("userInfo", data.result)
                } else {
                    myLocal.setItem("userInfo", data.result);
                }
            },
            error: function (err) {
                console.log(err)
            },
        });
    }



    function deleteIllness(obj, id) {
        $.ajax({
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'POST',
            url: IP + '/api-record/anamnesis/delete',
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json',
            data: {
                "id": id,
            },
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    obj.remove();
                } else {

                }
            },
            error: function (err) {
                console.log(err);
            },
        })
    }

    // 输入框焦点效果切换
    $('.illnessSearch').focus(function () {
        $(this).parents('.medicalItem').addClass('active').siblings('div').removeClass('active');
        $(this).parents('.medicalItem').siblings('div').find('.selectUl').hide();
        $(this).parents('.medicalItem').siblings('div').find('.illnessSearch').val('');
    }).blur(function () {
        $(this).parents('.medicalItem').removeClass('active');
    });
    // 过敏药物
    $('.drugAllergy').on('input', function (e) {
        $.ajax({
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'POST',
            url: IP + '/api-stata/anamnesisAllergyDrug/search',
            dataType: 'json',
            data: {
                "spellName": $('.drugAllergy').val(),
            },
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    var arr = data.result;
                    var _html = '';
                    for (var i = 0; i < arr.length; i++) {
                        _html += '<li class="selectItem" name="' + arr[i].id + '">' + arr[i].allergyDrugName + '</li>'
                    }
                    $('.drugAllergyAdd').show().html(_html);
                } else {
                    $('.drugAllergyAdd').hide();
                }
            },
            error: function (err) {

            },
        });
    })

    // 添加过敏病
    var drugAllergyArr = [];
    var drugAllergyTemp = myLocal.getItem('userInfo') && myLocal.getItem('userInfo').anamnesisAllergyDrugList ? myLocal.getItem('userInfo').anamnesisAllergyDrugList : [];
    drugAllergyTemp.length > 0 ? $('.drugAllergyUl').css("display", 'flex') : null;
    var _drugAllergyHtml = '';
    for (var i = 0; i < drugAllergyTemp.length; i++) {
        drugAllergyArr.push(drugAllergyTemp[i].orderId);
        _drugAllergyHtml += '<li class="selectItem" type="old" orderId="' + drugAllergyTemp[i].orderId + '" name="' + drugAllergyTemp[i].id + '">' + drugAllergyTemp[i].anamnesisRemark + '</li>';
    };
    $('.drugAllergyUl').html(_drugAllergyHtml);
    $(".drugAllergyAdd").delegate("li", "click", function () {
        if (drugAllergyArr.indexOf($(this).attr('name')) == -1) {
            $('.drugAllergyUl').css("display", 'flex');
            drugAllergyArr.push($(this).attr('name'));
            $(this).clone(true).appendTo(".drugAllergyUl");
            $(".drugAllergyAdd").hide();
            $('.drugAllergy').val("");
        }
    });

    // 删除过敏药物

    $('.drugAllergyUl').delegate('li', "click", function () {
        if ($(this).attr('type') == 'old') {
            deleteIllness($(this), $(this).attr('name'));
        } else {
            $(this).remove();
        }
        drugAllergyArr.splice(drugAllergyArr.indexOf($(this).attr('name')), 1);
        if (drugAllergyArr.length <= 0) {
            $('.drugAllergyUl').hide();
        }

    })

    // 既往病史
    $('.illnessInput').on('input', function (e) {
        $.ajax({
            type: 'POST',
            url: IP + '/api-stata/anamnesisIllness/search',
            dataType: 'json',
            data: {
                "token": myLocal.getItem('token'),
                "spellName": $('.illnessInput').val(),
            },
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    var arr = data.result;
                    var _html = '';
                    for (var i = 0; i < arr.length; i++) {
                        _html += '<li name="' + arr[i].id + '">' + arr[i].anamnesisIllnessName + '</li>'
                    }
                    $('.illnessAdd').show().html(_html);
                } else {
                    $('.illnessAdd').hide();
                }
            },
            error: function (err) {

            },
        });
    })
    var illnessAddArr = [];
    var illnessTemp = myLocal.getItem('userInfo') && myLocal.getItem('userInfo').anamnesisIllnessList ? myLocal.getItem('userInfo').anamnesisIllnessList : [];
    illnessTemp.length > 0 ? $('.illnessUl').css("display", 'flex') : null;
    var _illnessHtml = '';
    for (var i = 0; i < illnessTemp.length; i++) {
        illnessAddArr.push(illnessTemp[i].orderId);
        _illnessHtml += '<li class="selectItem" type="old" orderId="' + illnessTemp[i].orderId + '" name="' + illnessTemp[i].id + '">' + illnessTemp[i].anamnesisRemark + '</li>';
    };
    $(".illnessUl").html(_illnessHtml);
    $(".illnessAdd").delegate("li", "click", function () {
        if (illnessAddArr.indexOf($(this).attr('name')) == -1) {
            $(".illnessUl").css('display', 'flex');
            illnessAddArr.push($(this).attr('name'));
            $(this).clone(true).appendTo(".illnessUl");
            $(".illnessAdd").hide();
            $('.illnessInput').val("");
        }
    });
    $('.illnessUl').delegate('li', "click", function () {
        if ($(this).attr('type') == 'old') {
            deleteIllness($(this), $(this).attr('name'));
        } else {
            $(this).remove();
        }
        illnessAddArr.splice(illnessAddArr.indexOf($(this).attr('name')), 1);
        if (illnessAddArr.length <= 0) {
            $('.illnessUl').hide();
        }

    })
    // 手术病
    $('.surgeryInput').on('input', function (e) {
        $.ajax({
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'POST',
            url: IP + '/api-stata/surgicalHistory/search',
            dataType: 'json',
            data: {
                "spellName": $('.surgeryInput').val(),
            },
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    var arr = data.result;
                    var _html = '';
                    for (var i = 0; i < arr.length; i++) {
                        _html += '<li name="' + arr[i].id + '">' + arr[i].surgicalHistoryName + '</li>'
                    }
                    $('.surgeryAdd').show().html(_html);
                } else {
                    $('.surgeryAdd').hide();
                }
            },
            error: function (err) {

            },
        });
    });
    var surgeryAddArr = [];
    var surgeryTemp = myLocal.getItem('userInfo') && myLocal.getItem('userInfo').anamnesisSurgicalHistoryList ? myLocal.getItem('userInfo').anamnesisSurgicalHistoryList : [];
    surgeryTemp.length > 0 ? $('.surgeryUl').css("display", 'flex') : null;
    var _surgeryHtml = '';
    for (var i = 0; i < surgeryTemp.length; i++) {
        surgeryAddArr.push(surgeryTemp[i].orderId);
        _surgeryHtml += '<li class="selectItem" type="old" orderId="' + surgeryTemp[i].orderId + '" name="' + surgeryTemp[i].id + '">' + surgeryTemp[i].anamnesisRemark + '</li>';
    };
    $(".surgeryUl").html(_surgeryHtml);
    $(".surgeryAdd").delegate("li", "click", function () {
        if (surgeryAddArr.indexOf($(this).attr('name')) == -1) {
            $(".surgeryUl").css('display', 'flex');
            surgeryAddArr.push($(this).attr('name'));
            $(this).clone(true).appendTo(".surgeryUl");
            $(".surgeryAdd").hide();
            $('.surgeryInput').val("");
        }
    });
    $('.surgeryUl').delegate('li', "click", function () {
        if ($(this).attr('type') == 'old') {
            deleteIllness($(this), $(this).attr('name'));
        } else {
            $(this).remove();
        }
        surgeryAddArr.splice(surgeryAddArr.indexOf($(this).attr('name')), 1);
        if (surgeryAddArr.length <= 0) {
            $('.surgeryUl').hide();
        }
    })
    // 正在服用的药物
    $('.eatingDrugInput').on('input', function (e) {
        $.ajax({
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'POST',
            url: IP + '/api-stata/anamnesisEatingDrug/search',
            dataType: 'json',
            data: {
                "spellName": $('.eatingDrugInput').val(),
            },
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    var arr = data.result;
                    var _html = '';
                    for (var i = 0; i < arr.length; i++) {
                        _html += '<li name="' + arr[i].id + '">' + arr[i].eatingDrugName + '</li>'
                    }
                    $('.eatingDrugAdd').show().html(_html);
                } else {
                    $('.eatingDrugAdd').hide();
                }
            },
            error: function (err) {

            },
        });
    })
    var eatingDrugAddArr = [];
    var eatingDrugTemp = myLocal.getItem('userInfo') && myLocal.getItem('userInfo').anamnesisEatingDrugList ? myLocal.getItem('userInfo').anamnesisEatingDrugList : [];
    eatingDrugTemp.length > 0 ? $('.eatingDrugUl').css("display", 'flex') : null;
    var _eatingDrugHtml = '';
    for (var i = 0; i < eatingDrugTemp.length; i++) {
        eatingDrugAddArr.push(eatingDrugTemp[i].orderId);
        _eatingDrugHtml += '<li class="selectItem" type="old" orderId="' + eatingDrugTemp[i].orderId + '" name="' + eatingDrugTemp[i].id + '">' + eatingDrugTemp[i].anamnesisRemark + '</li>';
    };
    $(".eatingDrugUl").html(_eatingDrugHtml);
    $(".eatingDrugAdd").delegate("li", "click", function () {
        if (eatingDrugAddArr.indexOf($(this).attr('name')) == -1) {
            $('.eatingDrugUl').css('display', 'flex');
            eatingDrugAddArr.push($(this).attr('name'));
            $(this).clone(true).appendTo(".eatingDrugUl");
            $(".eatingDrugAdd").hide();
            $('.eatingDrugInput').val("");
        }
    });
    $('.eatingDrugUl').delegate('li', "click", function () {
        if ($(this).attr('type') == 'old') {
            deleteIllness($(this), $(this).attr('name'));
        } else {
            $(this).remove();
        }
        eatingDrugAddArr.splice(eatingDrugAddArr.indexOf($(this).attr('name')), 1);
        if (eatingDrugAddArr.length <= 0) {
            $('.eatingDrugUl').hide();
        }
    })

    // 配偶 子女 父母 自己 其他
    $(".submitBtn").click(function () {
        // 添加就诊人
        if (!userInfo) {
            layer.msg("请先上传身份证");
        } else {
            if (flag) {
                // 新建就诊人
                $.ajax({
                    headers: {
                        Accept: "application/json; charset=utf-8",
                        token: myLocal.getItem("token"),
                    },
                    type: 'POST',
                    url: IP + '/api-record/healthArchive/add',
                    xhrFields: {
                        withCredentials: true,
                    },
                    data: {
                        "patientId": userInfo.id,
                        "anamnesisAllergyDrugIds": drugAllergyArr.toString(),//过敏药物ID数组
                        "anamnesisIllnessIds": illnessAddArr.toString(),//病史疾病ID
                        "anamnesisEatingDrugIds": eatingDrugAddArr.toString(),//正在服用药物ID数组
                        "anamnesisSurgicalHistoryIds": surgeryAddArr.toString(),//手术史ID数组
                        "patientSource": $(".patientSource").val(),
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        if (data.code == 20000) {
                            window.history.back();
                        } else if (data.code == '50000') {

                        } else {
                            layer.msg("保存失败");
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                })
            } else {
                // 修改就诊人
                $.ajax({
                    headers: {
                        Accept: "application/json; charset=utf-8",
                        token: myLocal.getItem("token"),
                    },
                    type: 'POST',
                    url: IP + '/api-record/anamnesis/update',
                    xhrFields: {
                        withCredentials: true,
                    },
                    data: {
                        "patientId": userInfo.id,
                        "anamnesisAllergyDrugIds": drugAllergyArr.toString(),//过敏药物ID数组
                        "anamnesisIllnessIds": illnessAddArr.toString(),//病史疾病ID
                        "anamnesisEatingDrugIds": eatingDrugAddArr.toString(),//正在服用药物ID数组
                        "anamnesisSurgicalHistoryIds": surgeryAddArr.toString(),//手术史ID数组
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        if (data.code == 20000) {
                            layer.msg("修改成功");
                            setTimeout(function () {
                                window.history.back();
                            }, 1000)
                        } else if (data.code == '50000') {

                        } else {
                            layer.msg("修改失败");
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
                    type: 'POST',
                    url: IP + '/api-record/userPatient/update',
                    xhrFields: {
                        withCredentials: true,
                    },
                    data: {
                        "patientId": userInfo.id,
                        "patientSource": $(".patientSource").val(),
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                    },
                    error: function (err) {
                        console.log(err);
                    },
                })
            }
        }
    })
})
