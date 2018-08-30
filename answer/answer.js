$(function () {

    $.ajax({
        headers: {
            token: myLocal.getItem("token"),
        },
        type: 'POST',
        url: IP + '/api-assessmen/assessment/getLastByPatientId',
        xhrFields: {
            withCredentials: true
        },
        dataType: 'json',
        data: {
            "patientId": myLocal.getItem('userInfo').id,
        },
        success: function (data) {
            console.log(data)
            if (data.code == 20000) {
                $('.latelyContent').show();
                $('.latelyBox').css('display', 'flex');
                $('.minute').html(data.result.totalScore);
                $('.degree').html("[" + data.result.caution.replace('症状', '') + "]");
                $('.latelyInfo .time').html("评测时间：" + data.result.createTime);
                if (data.result.scoreType == 'A') {
                    $('.latelyBtn').attr({
                        'href': '/chestnut/recordInfo/recordInfo.html?A',
                        'name': data.result.id
                    });
                } else {
                    $('.latelyBtn').attr({
                        'href': '/chestnut/recordInfo/recordInfo.html?B',
                        'name': data.result.id
                    });
                }
            } else {
                $('.latelyContent').hide();
                $('.latelyInfo').css('display', 'none');
            }
        },
        error: function (err) {
            console.log(err);
        },
    })
    $('.latelyBtn').click(function () {
        myLocal.setItem("scoreId", $(this).attr('name'));
    })

    // 题库数组
    var answerArr = []; //装题的数组
    var answerIndex = 0; // 当前题号
    var answerCount = 0; // 总题号
    var moreObj = null;
    // 判断用户年龄
    if (myLocal.getItem('ageFlag') == '1' || myLocal.getItem('userInfo').patientAge >= 50) {
        $.ajax({
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'GET',
            url: IP + '/api-stata/ipss/getAll',
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    var dataArr = data.result;
                    // 循环分别不同类型的题
                    for (var i = 0; i < dataArr.length; i++) {
                        if (dataArr[i].ipssType == 'a') {
                            var tempArr = dataArr[i].childList;
                            // 循环分别 单项选择 还是 多项选择
                            for (var j = 0; j < tempArr.length; j++) {
                                if (tempArr[j].ipssType == 0) {
                                    // 循环单项选择题
                                    for (var x = 0; x < tempArr[j].childList.length; x++) {
                                        var _html = '<div class="leftItem">\
                                            <div class="portraitBox">\
                                                <img src="/chestnut/images/user.png" alt="头像">\
                                            </div>\
                                            <div class="topicBox">' + tempArr[j].childList[x].ipssTitle + '</div>\
                                        </div>\
                                        <div class="rightItem" ipssType="a" score="1" card="1">\
                                            <div class="optionsBox">\
                                                <a class="active" value="1" href="javascript:;">是</a>\
                                                <a value="0" href="javascript:;">否</a>\
                                            </div>\
                                            <div class="portraitBox">\
                                                <img src="/chestnut/images/user.png" alt="头像">\
                                            </div>\
                                        </div>'
                                        answerArr.push(_html);
                                    }
                                } else {
                                    // 多项选择
                                    var _html = '<div class="leftItem">\
                                        <div class="portraitBox">\
                                            <img src="/chestnut/images/user.png" alt="头像">\
                                        </div>\
                                        <div class="topicBox">' + tempArr[j].ipssTitle + '</div>\
                                    </div>\
                                    <div class="rightItem popupBox" ipssType="a" score="0" card="">\
                                        <a class="popupBtn" data=' + JSON.stringify(tempArr[j]) + ' href="javascript:;">点击请选择</a>\
                                        <div class="portraitBox">\
                                            <img src="/chestnut/images/user.png" alt="头像">\
                                        </div>\
                                    </div>';
                                    answerArr.push(_html);
                                }
                            }
                        } else if (dataArr[i].ipssType == 'b') {
                            var tempArr = dataArr[i].childList;
                            // 循环分别 单项选择 还是 多项选择
                            for (var j = 0; j < tempArr.length; j++) {
                                if (tempArr[j].ipssType == 0) {
                                    // 循环单项选择题
                                    for (var x = 0; x < tempArr[j].childList.length; x++) {
                                        var _html = '<div class="leftItem">\
                                            <div class="portraitBox">\
                                                <img src="/chestnut/images/user.png" alt="头像">\
                                            </div>\
                                            <div class="topicBox">' + tempArr[j].childList[x].ipssTitle + '</div>\
                                        </div>\
                                        <div class="rightItem" ipssType="b" score="1" card="1">\
                                            <div class="optionsBox">\
                                                <a class="active" value="1" href="javascript:;">是</a>\
                                                <a value="0" href="javascript:;">否</a>\
                                            </div>\
                                            <div class="portraitBox">\
                                                <img src="/chestnut/images/user.png" alt="头像">\
                                            </div>\
                                        </div>'
                                        answerArr.push(_html);
                                    }
                                } else {
                                    // 多项选择
                                    var _html = '<div class="leftItem">\
                                        <div class="portraitBox">\
                                            <img src="/chestnut/images/user.png" alt="头像">\
                                        </div>\
                                        <div class="topicBox">' + tempArr[j].ipssTitle + '</div>\
                                    </div>\
                                    <div class="rightItem popupBox" ipssType="b" score="0" card="">\
                                        <a class="popupBtn" data=' + JSON.stringify(tempArr[j]) + ' href="javascript:;">点击请选择</a>\
                                        <div class="portraitBox">\
                                            <img src="/chestnut/images/user.png" alt="头像">\
                                        </div>\
                                    </div>';
                                    answerArr.push(_html);
                                }
                            }

                        } else if (dataArr[i].ipssType == 'c') {
                            var tempArr = dataArr[i].childList;
                            // 循环分别 单项选择 还是 多项选择
                            for (var j = 0; j < tempArr.length; j++) {
                                if (tempArr[j].ipssType == 0) {
                                    // 循环单项选择题
                                    for (var x = 0; x < tempArr[j].childList.length; x++) {
                                        var _html = '<div class="leftItem">\
                                            <div class="portraitBox">\
                                                <img src="/chestnut/images/user.png" alt="头像">\
                                            </div>\
                                            <div class="topicBox">' + tempArr[j].childList[x].ipssTitle + '</div>\
                                        </div>\
                                        <div class="rightItem" ipssType="c" score="1" card="1">\
                                            <div class="optionsBox">\
                                                <a class="active" value="1" href="javascript:;">是</a>\
                                                <a value="0" href="javascript:;">否</a>\
                                            </div>\
                                            <div class="portraitBox">\
                                                <img src="/chestnut/images/user.png" alt="头像">\
                                            </div>\
                                        </div>'
                                        answerArr.push(_html);
                                    }
                                } else {
                                    // 多项选择
                                    var _html = '<div class="leftItem">\
                                        <div class="portraitBox">\
                                            <img src="/chestnut/images/user.png" alt="头像">\
                                        </div>\
                                        <div class="topicBox">' + tempArr[j].ipssTitle + '</div>\
                                    </div>\
                                    <div class="rightItem popupBox" ipssType="c" score="0" card="">\
                                        <a class="popupBtn" data=' + JSON.stringify(tempArr[j]) + ' href="javascript:;">点击请选择</a>\
                                        <div class="portraitBox">\
                                            <img src="/chestnut/images/user.png" alt="头像">\
                                        </div>\
                                    </div>';
                                    answerArr.push(_html);
                                }
                            }
                        }
                    }
                    answerCount = answerArr.length;
                    $('.answerCount').html(answerCount);
                    $('.answerContent').append(answerArr[answerIndex]);
                    answerIndex++;
                    $('.answerIndex').html(answerIndex);
                } else {
                    answerArr = [];
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
    } else {
        $.ajax({
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'GET',
            url: IP + '/api-stata/nihCpsi/getAll',
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    var dataArr = data.result;
                    // 循环分别不同类型的题
                    for (var i = 0; i < dataArr.length; i++) {
                        if (dataArr[i].nihCpsiType == 'a') {
                            var tempArr = dataArr[i].childList;
                            // 循环分别 单项选择 还是 多项选择
                            for (var j = 0; j < tempArr.length; j++) {
                                if (tempArr[j].nihCpsiType == 0) {
                                    // 循环单项选择题
                                    for (var x = 0; x < tempArr[j].childList.length; x++) {
                                        var _html = '<div class="leftItem">\
                                            <div class="portraitBox">\
                                                <img src="/chestnut/images/user.png" alt="头像">\
                                            </div>\
                                            <div class="topicBox">'+ tempArr[j].nihCpsiTitle + tempArr[j].childList[x].nihCpsiTitle + '</div>\
                                        </div>\
                                        <div class="rightItem" nihCpsiType="a" score="1" card="1">\
                                            <div class="optionsBox">\
                                                <a class="active" value="1" href="javascript:;">是</a>\
                                                <a value="0" href="javascript:;">否</a>\
                                            </div>\
                                            <div class="portraitBox">\
                                                <img src="/chestnut/images/user.png" alt="头像">\
                                            </div>\
                                        </div>'
                                        answerArr.push(_html);
                                    }
                                } else {
                                    // 多项选择
                                    var _html = '<div class="leftItem">\
                                        <div class="portraitBox">\
                                            <img src="/chestnut/images/user.png" alt="头像">\
                                        </div>\
                                        <div class="topicBox">' + tempArr[j].nihCpsiTitle + '</div>\
                                    </div>\
                                    <div class="rightItem popupBox" nihCpsiType="a" score="0" card="">\
                                        <a class="popupBtn" data=' + JSON.stringify(tempArr[j]) + ' href="javascript:;">点击请选择</a>\
                                        <div class="portraitBox">\
                                            <img src="/chestnut/images/user.png" alt="头像">\
                                        </div>\
                                    </div>';
                                    answerArr.push(_html);
                                }
                            }
                        } else if (dataArr[i].nihCpsiType == 'b') {
                            var tempArr = dataArr[i].childList;
                            // 循环分别 单项选择 还是 多项选择
                            for (var j = 0; j < tempArr.length; j++) {
                                if (tempArr[j].nihCpsiType == 0) {
                                    // 循环单项选择题
                                    for (var x = 0; x < tempArr[j].childList.length; x++) {
                                        var _html = '<div class="leftItem">\
                                            <div class="portraitBox">\
                                                <img src="/chestnut/images/user.png" alt="头像">\
                                            </div>\
                                            <div class="topicBox">' + tempArr[j].childList[x].nihCpsiTitle + '</div>\
                                        </div>\
                                        <div class="rightItem" nihCpsiType="b" score="1" card="1">\
                                            <div class="optionsBox">\
                                                <a class="active" value="1" href="javascript:;">是</a>\
                                                <a value="0" href="javascript:;">否</a>\
                                            </div>\
                                            <div class="portraitBox">\
                                                <img src="/chestnut/images/user.png" alt="头像">\
                                            </div>\
                                        </div>'
                                        answerArr.push(_html);
                                    }
                                } else {
                                    // 多项选择
                                    var _html = '<div class="leftItem">\
                                        <div class="portraitBox">\
                                            <img src="/chestnut/images/user.png" alt="头像">\
                                        </div>\
                                        <div class="topicBox">' + tempArr[j].nihCpsiTitle + '</div>\
                                    </div>\
                                    <div class="rightItem popupBox" nihCpsiType="b" score="0" card="">\
                                        <a class="popupBtn" data=' + JSON.stringify(tempArr[j]) + ' href="javascript:;">点击请选择</a>\
                                        <div class="portraitBox">\
                                            <img src="/chestnut/images/user.png" alt="头像">\
                                        </div>\
                                    </div>';
                                    answerArr.push(_html);
                                }
                            }

                        } else if (dataArr[i].nihCpsiType == 'c') {
                            var tempArr = dataArr[i].childList;
                            // 循环分别 单项选择 还是 多项选择
                            for (var j = 0; j < tempArr.length; j++) {
                                if (tempArr[j].nihCpsiType == 0) {
                                    // 循环单项选择题
                                    for (var x = 0; x < tempArr[j].childList.length; x++) {
                                        var _html = '<div class="leftItem">\
                                            <div class="portraitBox">\
                                                <img src="/chestnut/images/user.png" alt="头像">\
                                            </div>\
                                            <div class="topicBox">' + tempArr[j].childList[x].nihCpsiTitle + '</div>\
                                        </div>\
                                        <div class="rightItem" nihCpsiType="c" score="1" card="1">\
                                            <div class="optionsBox">\
                                                <a class="active" value="1" href="javascript:;">是</a>\
                                                <a value="0" href="javascript:;">否</a>\
                                            </div>\
                                            <div class="portraitBox">\
                                                <img src="/chestnut/images/user.png" alt="头像">\
                                            </div>\
                                        </div>'
                                        answerArr.push(_html);
                                    }
                                } else {
                                    // 多项选择
                                    var _html = '<div class="leftItem">\
                                        <div class="portraitBox">\
                                            <img src="/chestnut/images/user.png" alt="头像">\
                                        </div>\
                                        <div class="topicBox">' + tempArr[j].nihCpsiTitle + '</div>\
                                    </div>\
                                    <div class="rightItem popupBox" nihCpsiType="c" score="0" card="">\
                                        <a class="popupBtn" data=' + JSON.stringify(tempArr[j]) + ' href="javascript:;">点击请选择</a>\
                                        <div class="portraitBox">\
                                            <img src="/chestnut/images/user.png" alt="头像">\
                                        </div>\
                                    </div>';
                                    answerArr.push(_html);
                                }
                            }
                        }
                    }
                    answerCount = answerArr.length;
                    $('.answerCount').html(answerCount);
                    $('.answerContent').append(answerArr[answerIndex]);
                    answerIndex++;
                    $('.answerIndex').html(answerIndex);
                } else {
                    answerArr = [];
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
    }

    // 单选题按钮
    $('.answerContent').delegate('.optionsBox > a', 'click', function () {
        $(this).addClass('active').siblings('a').removeClass('active');
        $(this).parents('.rightItem').attr({
            "score": $(this).attr('value'),
            "card": $(this).attr('value'),
        });
        if ((answerIndex * 2 + 1) == $(this).parents('.rightItem').index()) {
            if (answerIndex >= answerCount) {
                $('.completeBox').fadeIn();
            } else {
                $('.answerContent').append(answerArr[answerIndex]);
                $('html,body').scrollTop($('html,body')[0].scrollHeight);
                answerIndex++;
                $('.answerIndex').html(answerIndex);
            }
        }
    })

    // 多选项题
    // 弹出多项选择
    $('.answerContent').delegate('.popupBtn', 'click', function () {
        moreObj = $(this);
        $('.multitermContent').css('display', 'flex');
        var data = JSON.parse($(this).attr('data'));
        var _html = '';
        if (myLocal.getItem('ageFlag') == '1' || myLocal.getItem('userInfo').patientAge >= 50) {
            for (var i = 0; i < data.childList.length; i++) {
                if (i == moreObj.parents('.rightItem').attr('score')) {
                    _html += '<a class="optionBtn active" score="' + data.childList[i].ipssScore + '" href="javascript:;">' + data.childList[i].ipssTitle + '</a>';
                } else {
                    _html += '<a class="optionBtn" score="' + data.childList[i].ipssScore + '" href="javascript:;">' + data.childList[i].ipssTitle + '</a>';
                }
            }
            $('.multitermBox > h3').html(data.ipssTitle);
        } else {
            for (var i = 0; i < data.childList.length; i++) {
                if (i == moreObj.parents('.rightItem').attr('score')) {
                    _html += '<a class="optionBtn active" score="' + data.childList[i].nihCpsiScore + '" href="javascript:;">' + data.childList[i].nihCpsiTitle + '</a>';
                } else {
                    _html += '<a class="optionBtn" score="' + data.childList[i].nihCpsiScore + '" href="javascript:;">' + data.childList[i].nihCpsiTitle + '</a>';
                }
            }
            $('.multitermBox > h3').html(data.nihCpsiTitle);
        }

        $('.optionBox').html(_html);
    });
    // 具体选择
    $('.optionBox').delegate('a', 'click', function () {
        // 切换选项焦点
        $(this).addClass('active').siblings('a').removeClass('active');
        // 整理分数 和 答题板
        var cardHtml = '';
        for (var j = 0; j <= $(this).siblings('a').length; j++) {
            if ($(this).index() == j) {
                cardHtml += '1';
            } else {
                cardHtml += '0';
            }
        }
        moreObj.html($(this).html());
        moreObj.parents('.rightItem').attr({
            "score": $(this).attr('score'),
            "card": cardHtml,
        });
        // 关闭当前
        $('.multitermContent').css('display', 'none');
        // 调出下一题
        if ((answerIndex * 2 + 1) == moreObj.parents('.rightItem').index()) {
            if (answerIndex >= answerCount) {
                $('.completeBox').fadeIn();
                // $('html,body').scrollTop($('html,body')[0].scrollHeight);
            } else {
                $('.answerContent').append(answerArr[answerIndex]);
                $('html,body').scrollTop($('html,body')[0].scrollHeight);
                answerIndex++;
                $('.answerIndex').html(answerIndex);
            }
        }
    })

    // 提交按钮
    $('.completeBtn').click(function () {
        layer.msg('信息提交中，请稍等...')
        var inflammationScore = 0;
        var symptomScore = 0;
        var lifeScore = 0;
        var answer = '';
        if (myLocal.getItem('ageFlag') == '1' || myLocal.getItem('userInfo').patientAge >= 50) {
            var objArr = $('.rightItem');
            for (var i = 0; i < objArr.length; i++) {
                answer += objArr.eq(i).attr('card');
                if (objArr.eq(i).attr('ipssType') == 'a') {
                    inflammationScore += Number(objArr.eq(i).attr('score'));
                } else if (objArr.eq(i).attr('ipssType') == 'b') {
                    symptomScore += Number(objArr.eq(i).attr('score'));
                } else if (objArr.eq(i).attr('ipssType') == 'c') {
                    lifeScore += Number(objArr.eq(i).attr('score'));
                }
            }
            $.ajax({
                headers: {
                    token: myLocal.getItem("token"),
                },
                type: 'POST',
                url: IP + '/api-assessmen/patientIpssScore/add',
                dataType: 'json',
                data: {
                    "patientId": myLocal.getItem('userInfo').id,
                    "symptomScore": inflammationScore,
                    "lifeScore": symptomScore,
                    "ipssScore": inflammationScore + symptomScore + lifeScore,
                    "answer": answer,
                },
                success: function (data) {
                    console.log(data)
                    if (data.code == 20000) {
                        // 保存查询答案的id
                        myLocal.setItem('scoreId', data.result.id);
                        // 保存症状程度
                        myLocal.setItem('degree', data.result.caution);
                        // 保存症状分值
                        myLocal.setItem('score', data.result.ipssScore);
                        window.location = '/chestnut/assessResult/assessResult.html?B'
                    } else if (data.code == 50005) {
                        layer.msg('今天已添加过，每天仅限添加一条');
                    } else {

                    }
                },
                error: function (err) {

                },
            });
        } else {

            var objArr = $('.rightItem');
            for (var i = 0; i < objArr.length; i++) {
                answer += objArr.eq(i).attr('card');
                if (objArr.eq(i).attr('nihcpsitype') == 'a') {
                    inflammationScore += Number(objArr.eq(i).attr('score'));
                } else if (objArr.eq(i).attr('nihcpsitype') == 'b') {
                    symptomScore += Number(objArr.eq(i).attr('score'));
                } else if (objArr.eq(i).attr('nihcpsitype') == 'c') {
                    lifeScore += Number(objArr.eq(i).attr('score'));
                }
            }
            $.ajax({
                headers: {
                    token: myLocal.getItem("token"),
                },
                type: 'POST',
                url: IP + '/api-assessmen/patientNihCpsiScore/add',
                dataType: 'json',
                data: {
                    "patientId": myLocal.getItem('userInfo').id,
                    "inflammationScore": inflammationScore,
                    "symptomScore": symptomScore,
                    "lifeScore": lifeScore,
                    "nihCpsiScore": inflammationScore + symptomScore + lifeScore,
                    "answer": answer,
                },
                success: function (data) {
                    console.log(data)
                    if (data.code == 20000) {
                        // 保存查询答案的id
                        myLocal.setItem('scoreId', data.result.id);
                        // 保存症状程度
                        myLocal.setItem('degree', data.result.caution);
                        // 保存症状分值
                        myLocal.setItem('score', data.result.nihCpsiScore);
                        window.location = '/chestnut/assessResult/assessResult.html?A'
                    } else if (data.code == 50005) {
                        layer.msg('今天已添加过，每天仅限添加一条');
                    } else {

                    }
                },
                error: function (err) {

                },
            });
        }

    })



})
