$(function () {
    $.ajax({
        headers: {
            token: myLocal.getItem("token"),
        },
        type: 'GET',
        url: IP + '/api-record/patientAnamnesis/selete',
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log(data)
            if (data.code == '20000') {
                myLocal.setItem('userInfo', data.result);
            } else if (data.code == '40004') {
                myLocal.deleteItem('userInfo')
            } else {
                myLocal.setItem('userInfo', {});
            }
        },
        error: function (err) {
            console.log(err)
        },
    });

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
                "patientId": myLocal.getItem('userInfo').id,
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
    // 顶部Tab切换
    $('.tabBox > a').click(function () {
        var _index = $(this).index();
        $(this).addClass('active').siblings('a').removeClass('active');
        $('.contentBox > div').eq(_index).addClass('active').siblings('div').removeClass('active');
    })
    // 性别切换
    // $('.sexBox > a').click(function () {
    //     $(this).addClass('active').siblings('a').removeClass('active');
    // });



    // 用户名
    var patientName = $('.patientName');
    patientName.blur(function () {
        if (patientName.val() != '' && !RegExpObj.Reg_Name.test(patientName.val())) {
            $(this).addClass('error')
        }
    }).focus(function () {
        if (!RegExpObj.Reg_Name.test(patientName.val())) {
            $(this).removeClass('error');
            patientName.val("");
        }
    })

    // 身份证
    var patientCard = $('.patientCard');
    var patientBirthday = ''; // 出生日期
    var patientSex = ''; // 性别
    var patientCardFlag = false;
    patientCard.blur(function () {
        if (patientCard.val() == '' || !RegExpObj.Reg_IDCardNo.test(patientCard.val())) {
            $(this).addClass('error')
        } else {
            if ($(this).val().length == 18) {
                patientBirthday = $(this).val().substring(6, 14);
                $(this).val().substring(16, 17) % 2 == 1 ? patientSex = '0' : patientSex = '1';
                var date = new Date();
                var year = date.getFullYear();
                var birthday_year = parseInt($(this).val().substr(6, 4));
                var userage = year - birthday_year;
                $('.age').val(userage);
            } else {
                patientBirthday = 19 + $(this).val().substring(6, 12);
                $(this).val().substring(14, 15) % 2 == 1 ? patientSex = '0' : patientSex = '1';
                var date = new Date();
                var year = date.getFullYear();
                var birthday_year = parseInt($(this).val().substr(6, 4));
                var userage = year - birthday_year;
                $('.age').val(userage);
            }
            $('.patientBirthday').val(patientBirthday);
            $('.sexBox > a').removeClass('active').eq(patientSex).addClass('active');
        }
    }).focus(function () {
        if (!RegExpObj.Reg_IDCardNo.test(patientCard.val())) {
            $(this).removeClass('error');
            patientCard.val("");
        }
    })

    // 手机号
    var patientPhone = $('.patientPhone');
    patientPhone.blur(function () {
        if (patientPhone.val() != '' && !RegExpObj.Reg_TelNo.test(patientPhone.val())) {
            $(this).addClass('error')
        }
    }).focus(function () {
        if (!RegExpObj.Reg_TelNo.test(patientPhone.val())) {
            $(this).removeClass('error');
            patientPhone.val("");
        }
    })
    // 出生年月
    $('.patientBirthday').blur(function () {
        if ($('.patientBirthday').val() != '' && $('.patientBirthday').val().length != 8) {
            $(this).addClass('error')
        }
    }).focus(function () {
        if ($('.patientBirthday').val() != '' && $('.patientBirthday').val().length != 8) {
            $(this).removeClass('error');
            $('.patientBirthday').val("");
        }
    })
    // 年龄
    $('.age').blur(function () {
        if ($('.age').val() != '' && $('.age').val() <= 0 || $('.age').val() > 150) {
            $(this).addClass('error')
        }
    }).focus(function () {
        if ($('.age').val() <= 0 || $('.age').val() > 150) {
            $(this).removeClass('error');
            $('.age').val("");
        }
    })
    // 身高
    $('.patientHeight').blur(function () {
        if ($('.patientHeight').val() != '' && $('.patientHeight').val() <= 0 || $('.patientHeight').val() > 230) {
            $(this).addClass('error')
        }
    }).focus(function () {
        if ($('.patientHeight').val() <= 0 || $('.patientHeight').val() > 230) {
            $(this).removeClass('error');
            $('.patientHeight').val("");
        }
    })
    // 身高
    $('.patientWeight').blur(function () {
        if ($('.patientWeight').val() != '' && $('.patientWeight').val() <= 0 || $('.patientWeight').val() > 400) {
            $(this).addClass('error')
        }
    }).focus(function () {
        if ($('.patientWeight').val() <= 0 || $('.patientWeight').val() > 400) {
            $(this).removeClass('error');
            $('.patientWeight').val("");
        }
    })

    if (myLocal.getItem('userInfo')) {
        myLocal.getItem('userInfo') && myLocal.getItem('userInfo').patientSex == '男' ? $('.sexBox > a').removeClass('active').eq(0).addClass('active') : $('.sexBox > a').removeClass('active').eq(1).addClass('active');
        $('.patientWeight').val(myLocal.getItem('userInfo').patientWeight);
        $('.patientHeight').val(myLocal.getItem('userInfo').patientHeight);
        $('.age').val(myLocal.getItem('userInfo').patientAge);
        $('.patientBirthday').val(myLocal.getItem('userInfo').patientBirthday);
        $('.detailAddress').val(myLocal.getItem('userInfo').detailAddress);
        $('.patientName').val(myLocal.getItem('userInfo').patientName);
        $('.patientCard').val(myLocal.getItem('userInfo').patientCard);
        $('.patientPhone').val(myLocal.getItem('userInfo').patientPhone);
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
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'POST',
            url: IP + '/api-stata/anamnesisIllness/search',
            dataType: 'json',
            data: {
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

    // 提交事件
    $('.submitBtn').click(function () {
        if (!patientName.val()) {
            layer.msg('请填写姓名');
            patientName.addClass('error');
        } else if (patientName.val() != '' && !RegExpObj.Reg_Name.test(patientName.val())) {
            patientName.addClass('error');
        } else if (patientPhone.val() != '' && !RegExpObj.Reg_TelNo.test(patientPhone.val())) {
            patientPhone.addClass('error');
        } else if (!patientCard.val()) {
            layer.msg('请填写身份证号');
        } else if (!RegExpObj.Reg_IDCardNo.test(patientCard.val())) {
            patientCard.addClass('error');
        } else if ($('.patientBirthday').val() != '' && $('.patientBirthday').val().length != 8) {
            $('.patientBirthday').addClass('error');
        } else if ($('.age').val() != '' && $('.age').val() <= 0 || $('.age').val() > 150) {
            $('.age').addClass('error');
        } else if ($('.patientHeight').val() != '' && $('.patientHeight').val() <= 0 || $('.patientHeight').val() > 230) {
            $('.patientHeight').addClass('error');
        } else if ($('.patientWeight').val() != '' && $('.patientWeight').val() <= 0 || $('.patientWeight').val() > 400) {
            $('.patientWeight').addClass('error');
        } else {
            // 判断是否有id
            if (myLocal.getItem('userInfo') && myLocal.getItem('userInfo').id) {
                $.ajax({
                    headers: {
                        token: myLocal.getItem("token"),
                    },
                    type: 'POST',
                    url: IP + '/api-record/patientAnamnesis/update',
                    dataType: 'json',
                    data: {
                        "patientId": myLocal.getItem('userInfo').id,
                        "patientName": $('.patientName').val(),
                        "patientCard": $('.patientCard').val(),
                        "patientPhone": $('.patientPhone').val(),
                        "patientBirthday": $('.patientBirthday').val(),
                        "patientSex": $('.sexBox a.active').index() == 0 ? '男' : '女',
                        "patientAge": $('.age').val(),
                        "patientHeight": $('.patientHeight').val(),
                        "patientWeight": $('.patientWeight').val(),
                        "detailAddress": $('.detailAddress').val(),
                        "anamnesisAllergyDrugIds": drugAllergyArr.toString(),
                        "anamnesisIllnessIds": illnessAddArr.toString(),
                        "anamnesisEatingDrugIds": eatingDrugAddArr.toString(),
                        "anamnesisSurgicalHistoryIds": surgeryAddArr.toString(),
                    },
                    success: function (data) {
                        console.log(data)
                        if (data.code == 20000) {
                            myLocal.setItem("userInfo", {
                                "patientName": $('.patientName').val(),
                                "patientCard": $('.patientCard').val(),
                                "patientAge": $('.age').val(),
                            })
                            window.location.href = document.referrer;
                        } else {
                            layer.msg("修改失败")
                        }
                    },
                    error: function (err) {

                    },
                });
            } else {
                $.ajax({
                    headers: {
                        token: myLocal.getItem("token"),
                    },
                    type: 'POST',
                    url: IP + '/api-record/patientAnamnesis/weChatAdd',
                    dataType: 'json',
                    data: {
                        "patientName": $('.patientName').val(),
                        "patientCard": $('.patientCard').val(),
                        "patientPhone": $('.patientPhone').val(),
                        "patientBirthday": $('.patientBirthday').val(),
                        "patientSex": $('.sexBox a.active').index() == 0 ? '男' : '女',
                        "patientAge": $('.age').val(),
                        "patientHeight": $('.patientHeight').val(),
                        "patientWeight": $('.patientWeight').val(),
                        "detailAddress": $('.detailAddress').val(),
                        "anamnesisAllergyDrugIds": drugAllergyArr.toString(),
                        "anamnesisIllnessIds": illnessAddArr.toString(),
                        "anamnesisEatingDrugIds": eatingDrugAddArr.toString(),
                        "anamnesisSurgicalHistoryIds": surgeryAddArr.toString(),
                    },
                    success: function (data) {
                        console.log(data)
                        if (data.code == 20000) {
                            myLocal.setItem("userInfo", {
                                "patientName": $('.patientName').val(),
                                "patientCard": $('.patientCard').val(),
                                "patientAge": $('.age').val(),
                            })
                            window.location.href = document.referrer;
                        } else {
                            layer.msg("添加失败");
                        }
                    },
                    error: function (err) {

                    },
                });
            }
        }
    })
})
