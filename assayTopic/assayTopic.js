$(function () {


    // 进入此页面时的默认焦点  从上个页面通过地址栏带入的索引
    var _index = window.location.href.split('?')[1];
    $('.illnessTab > a').removeClass('active').eq(_index).addClass('active');
    $('.illnessContent > .illnessBox').hide().eq(_index).show();





    // 左侧Tab切换
    $('.illnessTab > a').click(function () {
        _index = $(this).index();
        $(this).addClass('active').siblings('a').removeClass('active');
        $('.illnessContent > .illnessBox').hide().eq(_index).show();
        if (!$(this).attr('dataFlag')) {
            getScale(_index);
        }
    });
    if (myLocal.getItem("results")) {
        var results = myLocal.getItem("results");
        if (results.bloodRoutineAnswer) {
            $('.illnessTab > a').eq(0).addClass('flag').attr('dataflag', 1);
            getScale(0);
        }
        if (results.urineRoutineAnswer) {
            $('.illnessTab > a').eq(1).addClass('flag').attr('dataflag', 1);
            getScale(1);
        }
        if (results.expressedProstaticSecretionAnswer) {
            $('.illnessTab > a').eq(2).addClass('flag').attr('dataflag', 1);
            getScale(2);
        }
        if (results.specificAntigenAnswer) {
            $('.illnessTab > a').eq(3).addClass('flag').attr('dataflag', 1);
            getScale(3);
        }
        if (results.ultrasonographyBAnswer) {
            $('.illnessTab > a').eq(4).addClass('flag').attr('dataflag', 1);
            getScale(4);
        }
        if (results.digitalRectalAnswer) {
            $('.illnessTab > a').eq(5).addClass('flag').attr('dataflag', 1);
            getScale(5);
        }
        if (results.urineFlowRateAnswer) {
            $('.illnessTab > a').eq(6).addClass('flag').attr('dataflag', 1);
            getScale(6);
        }
    }
    if (!$('.illnessTab > a').eq(_index).attr('dataFlag')) {
        getScale(_index);
    }

    // 获取tab对应的题
    function getScale(_index) {
        // tab顺序
        // 血常规
        // 尿常规
        // 前列腺按摩液
        // 前列腺特异性抗原
        // B超报告单
        // 前列腺指诊
        // 尿流率
        // **** tab顺序、地址数组顺序要对应 和 上个页面 按钮顺序 要对应
        var urlArr = ['/api-stata/scale/getBloodRoutine', '/api-stata/scale/getUrineRoutine', '/api-stata/scale/getExpressedProstaticSecretion', '/api-stata/scale/getSpecificAntigen', '/api-stata/scale/getUltrasonographyB', '/api-stata/scale/getDigitalRectal', '/api-stata/scale/getUrineFlowRate'];
        var url = urlArr[_index];
        $.ajax({
            headers: {
                token:myLocal.getItem("token"),
            },
            type: 'GET',
            url: IP + url,
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.code == '20000') {
                    var card = '';
                    $('.illnessTab > a').eq(_index).attr("dataFlag", '1');
                    if (myLocal.getItem("results")) {
                        var results = myLocal.getItem("results");
                        var inputTime = '';
                        switch (_index) {
                            case 0:
                                card = results.bloodRoutineAnswer ? results.bloodRoutineAnswer : '';
                                inputTime = results.bloodRoutineInspectTime ? results.bloodRoutineInspectTime : '';
                                $('.illnessContent .illnessBox').eq(_index).find('input').val(inputTime);
                                break;
                            case 1:
                                card = results.urineRoutineAnswer ? results.urineRoutineAnswer : '';
                                inputTime = results.urineRoutineInspectTime ? results.urineRoutineInspectTime : '';
                                $('.illnessContent .illnessBox').eq(_index).find('input').val(inputTime);
                                break;
                            case 2:
                                card = results.expressedProstaticSecretionAnswer ? results.expressedProstaticSecretionAnswer : '';
                                inputTime = results.expressedProstaticSecretionInspectTime ? results.expressedProstaticSecretionInspectTime : '';
                                $('.illnessContent .illnessBox').eq(_index).find('input').val(inputTime);
                                break;
                            case 3:
                                card = results.specificAntigenAnswer ? results.specificAntigenAnswer : '';
                                inputTime = results.specificAntigenInspectTime ? results.specificAntigenInspectTime : '';
                                $('.illnessContent .illnessBox').eq(_index).find('input').val(inputTime);
                                break;
                            case 4:
                                card = results.ultrasonographyBAnswer ? results.ultrasonographyBAnswer : '';
                                inputTime = results.ultrasonographyBInspectTime ? results.ultrasonographyBInspectTime : '';
                                $('.illnessContent .illnessBox').eq(_index).find('input').val(inputTime);
                                break;
                            case 5:
                                card = results.digitalRectalAnswer ? results.digitalRectalAnswer : '';
                                inputTime = results.digitalRectalInspectTime ? results.digitalRectalInspectTime : '';
                                $('.illnessContent .illnessBox').eq(_index).find('input').val(inputTime);
                                break;
                            case 6:
                                card = results.urineFlowRateAnswer ? results.urineFlowRateAnswer : '';
                                inputTime = results.urineFlowRateInspectTime ? results.urineFlowRateInspectTime : '';
                                $('.illnessContent .illnessBox').eq(_index).find('input').val(inputTime);
                                break;
                        }
                    }
                    var _html = '';
                    var tempArr = data.result;
                    var topicNum = 0; //题号
                    // 循环题目
                    for (var i = 0; i < tempArr.length; i++) {
                        // 装题目的变量
                        var cardHtml = '';
                        // 每道题的选项数组
                        var childList = tempArr[i].childList;

                        // 循环提选项 设置初始答案
                        for (var j = 0; j < childList.length; j++) {
                            if (card == '') {
                                j == childList.length - 1 ? cardHtml += '1' : cardHtml += '0';
                            } else {
                                cardHtml = card.substr(topicNum, childList.length);
                            }

                        }
                        topicNum += childList.length;
                        // 组装题目
                        _html += '<div class="answerItem" card="' + cardHtml + '">\
                            <h3>' + (i + 1) + '.' + tempArr[i].scaleTitle + '</h3>';
                        // 循环题选项
                        for (var j = 0; j < childList.length; j++) {
                            // 设置题目的默认选项
                            if (j == childList.length - 1) {
                                _html += '<a class="active" href="javascript:;">' + childList[j].scaleTitle + '</a>';
                            } else {
                                _html += '<a class="" href="javascript:;">' + childList[j].scaleTitle + '</a>';
                            }
                        }
                        _html += '</div>'
                    }
                    // 将组装好的题目放到对应的位置
                    $('.illnessContent .illnessBox').eq(_index).append(_html);
                    for (var i = 0; i < $('.answerItem').length; i++) {
                        var card = $('.answerItem').eq(i).attr('card');
                        $('.answerItem').eq(i).find('a').removeClass('active').eq(card.indexOf('1')).addClass('active');
                    }
                } else {
                    $('.illnessContent .illnessBox').eq(_index).append('');
                }
            },
            error: function (err) {
                console.log(err)
            },
        });
    }

    // 答题选择事件
    $('.illnessBox').delegate('.answerItem > a', 'click', function () {
        $(this).addClass('active').siblings('a').removeClass('active');
        var objArr = $(this).parents('.answerItem').find('a');
        var cardHtml = '';
        for (var i = 0; i < objArr.length; i++) {
            if (objArr.eq(i).hasClass('active')) {
                cardHtml += 1;
            } else {
                cardHtml += 0;
            }
        }
        $(this).parents('.answerItem').attr('card', cardHtml);
    })

    // 日期选择
    var thisObj = null;
    $('.timeBox > input').focus(function () {
        thisObj = $(this);
        $(this).blur();
        layer.open({
            title: '',
            type: 1,
            content: $('#dateContent'),
            closeBtn: false,
            shadeClose: false,
        });
    })
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#dateBox',
            position: 'static',
            showBottom: false,
            max: 0,
            done: function (value, date) {
                thisObj.val(value);
                layer.closeAll();
                $('#dateContent').hide();
                $('.illnessTab > a').eq(thisObj.parents('.illnessBox').index()).addClass('flag');
            }
        });
    });


    function submitFun() {
        layer.msg('提交中...')
        var objArr = $('.illnessTab .flag');
        var bloodRoutineAnswer = ""; //血常规量表结果0
        var digitalRectalAnswer = ""; //前列腺指诊量表结果5
        var expressedProstaticSecretionAnswer = ""; //前列腺按摩液检查量表2
        var specificAntigenAnswer = ""; //特异性抗原量表结果3
        var ultrasonographyBAnswer = ""; //B超量表结果4
        var urineFlowRateAnswer = ""; //尿流率量表结果6
        var urineRoutineAnswer = ""; //尿常规检查量表结果1
        var bloodRoutineInspectTime = ""; //血常规检查时间0
        var digitalRectalInspectTime = ""; //前列腺指诊检查时间5
        var expressedProstaticSecretionInspectTime = ""; //前列腺按摩液检查时间2
        var specificAntigenInspectTime = ""; //特异性抗原检查时间3
        var ultrasonographyBInspectTime = ""; //B超检查时间4
        var urineFlowRateInspectTime = ""; //尿流率检查时间6
        var urineRoutineInspectTime = ""; //尿常规检查时间1
        for (var i = 0; i < objArr.length; i++) {
            if (objArr.eq(i).index() == 0) {
                var objTemp = $('.illnessContent .illnessBox').eq(0).find('.answerItem');
                bloodRoutineInspectTime = $('.illnessContent .illnessBox').eq(0).find('input').val();
                for (var j = 0; j < objTemp.length; j++) {
                    bloodRoutineAnswer += objTemp.eq(j).attr('card');
                }
            } else if (objArr.eq(i).index() == 1) {
                var objTemp = $('.illnessContent .illnessBox').eq(1).find('.answerItem');
                urineRoutineInspectTime = $('.illnessContent .illnessBox').eq(1).find('input').val();
                for (var j = 0; j < objTemp.length; j++) {
                    urineRoutineAnswer += objTemp.eq(j).attr('card');
                }
            } else if (objArr.eq(i).index() == 2) {
                var objTemp = $('.illnessContent .illnessBox').eq(2).find('.answerItem');
                expressedProstaticSecretionInspectTime = $('.illnessContent .illnessBox').eq(2).find('input').val();
                for (var j = 0; j < objTemp.length; j++) {
                    expressedProstaticSecretionAnswer += objTemp.eq(j).attr('card');
                }
            } else if (objArr.eq(i).index() == 3) {
                var objTemp = $('.illnessContent .illnessBox').eq(3).find('.answerItem');
                specificAntigenInspectTime = $('.illnessContent .illnessBox').eq(3).find('input').val();
                for (var j = 0; j < objTemp.length; j++) {
                    specificAntigenAnswer += objTemp.eq(j).attr('card');
                }
            } else if (objArr.eq(i).index() == 4) {
                var objTemp = $('.illnessContent .illnessBox').eq(4).find('.answerItem');
                ultrasonographyBInspectTime = $('.illnessContent .illnessBox').eq(4).find('input').val();
                for (var j = 0; j < objTemp.length; j++) {
                    ultrasonographyBAnswer += objTemp.eq(j).attr('card');
                }
            } else if (objArr.eq(i).index() == 5) {
                var objTemp = $('.illnessContent .illnessBox').eq(5).find('.answerItem');
                digitalRectalInspectTime = $('.illnessContent .illnessBox').eq(5).find('input').val();
                for (var j = 0; j < objTemp.length; j++) {
                    digitalRectalAnswer += objTemp.eq(j).attr('card');
                }
            } else if (objArr.eq(i).index() == 6) {
                var objTemp = $('.illnessContent .illnessBox').eq(6).find('.answerItem');
                urineFlowRateInspectTime = $('.illnessContent .illnessBox').eq(6).find('input').val();
                for (var j = 0; j < objTemp.length; j++) {
                    urineFlowRateAnswer += objTemp.eq(j).attr('card');
                }
            }
        }
        var dataJson = {};
        dataJson["patientAge"] = myLocal.getItem('userInfo').patientAge;
        dataJson["prostaticMedicalExaminationId"] = myLocal.getItem('results') && myLocal.getItem('results').id ? myLocal.getItem('results').id : '';
        bloodRoutineAnswer ? dataJson["bloodRoutineAnswer"] = bloodRoutineAnswer : null;
        digitalRectalAnswer ? dataJson["digitalRectalAnswer"] = digitalRectalAnswer : null;
        expressedProstaticSecretionAnswer ? dataJson["expressedProstaticSecretionAnswer"] = expressedProstaticSecretionAnswer : null;
        specificAntigenAnswer ? dataJson["specificAntigenAnswer"] = specificAntigenAnswer : null;
        ultrasonographyBAnswer ? dataJson["ultrasonographyBAnswer"] = ultrasonographyBAnswer : null;
        urineFlowRateAnswer ? dataJson["urineFlowRateAnswer"] = urineFlowRateAnswer : null;
        urineRoutineAnswer ? dataJson["urineRoutineAnswer"] = urineRoutineAnswer : null;
        bloodRoutineInspectTime ? dataJson["bloodRoutineInspectTime"] = bloodRoutineInspectTime.replace(/-/gi, '/') : null;
        digitalRectalInspectTime ? dataJson["digitalRectalInspectTime"] = digitalRectalInspectTime.replace(/-/g, '/') : null;
        expressedProstaticSecretionInspectTime ? dataJson["expressedProstaticSecretionInspectTime"] = expressedProstaticSecretionInspectTime.replace(/-/g, '/') : null;
        specificAntigenInspectTime ? dataJson["specificAntigenInspectTime"] = specificAntigenInspectTime.replace(/-/g, '/') : null;
        ultrasonographyBInspectTime ? dataJson["ultrasonographyBInspectTime"] = ultrasonographyBInspectTime.replace(/-/g, '/') : null;
        urineFlowRateInspectTime ? dataJson["urineFlowRateInspectTime"] = urineFlowRateInspectTime.replace(/-/g, '/') : null;
        urineRoutineInspectTime ? dataJson["urineRoutineInspectTime"] = urineRoutineInspectTime.replace(/-/g, '/') : null;
        $.ajax({
            headers: {
                token:myLocal.getItem("token"),
            },
            type: 'POST',
            url: IP + '/api-assessmen/medicalExamination/add',
            dataType: 'json',
            data: dataJson,
            success: function (data) {
                console.log(data)
                if (data.code == '20000') {
                    myLocal.setItem('results', data.result);
                    window.location = '/chestnut/results/results.html';
                } else if (data.code == 50005) {
                    layer.msg('今天已添加过，每天仅限添加一条');
                } else {

                }
            },
            error: function (err) {
                console.log(err)
            },
        });
    }
    // 提交-确认
    $('.ageSelect').find('.yesBtn').click(function () {
        layer.closeAll();
        $('.ageSelect').hide();
        submitFun();
    })
    // 提交-取消
    $('.ageSelect').find('.noBtn').click(function () {
        layer.closeAll();
        $('.ageSelect').hide();
    })
    // 提交按钮
    $('.submitBtn').click(function () {
        var objArr = $('.illnessTab .flag');
        if (objArr.length > 0 && objArr.length < 7) {
            layer.open({
                title: '',
                type: 1,
                content: $('.ageSelect'),
                closeBtn: false,
                shadeClose: false,
            });
        } else if (objArr.length == 7) {
            submitFun();
        } else {
            layer.msg('请选择化验单信息');
        }
    })
})
