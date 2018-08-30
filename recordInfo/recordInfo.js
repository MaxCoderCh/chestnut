$(function () {
    if (window.location.href.split('?')[1] == 'A') {
        var optionScore = [];
        // 前列腺炎 nih 的答案
        $.ajax({
            headers: {
                token:myLocal.getItem("token"),
            },
            type: 'POST',
            url: IP + '/api-assessmen/patientNihCpsiScore/getById',
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json',
            data: {
                "nihCpsiScoreId": myLocal.getItem('scoreId'),
            },
            async: false,
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    optionScore = data.result.optionScore.split('-');
                } else {

                }
            },
            error: function (err) {
                console.log(err);
            },
        })

        // 前列腺炎 nih 的题目
        $.ajax({
            headers: {
                token:myLocal.getItem("token"),
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
                    var _html = '';
                    // 循环分别不同类型的题
                    for (var i = 0; i < dataArr.length; i++) {
                        if (dataArr[i].nihCpsiType == 'a') {
                            var tempArr = dataArr[i].childList;
                            // 循环分别 单项选择 还是 多项选择
                            for (var j = 0; j < tempArr.length; j++) {
                                if (tempArr[j].nihCpsiType == 0) {
                                    // 循环单项选择题
                                    for (var x = 0; x < tempArr[j].childList.length; x++) {
                                        _html += '<div class="topicItem">\
                                            <div class="topicBox">\
                                                <p><span class="num"></span><span>' + tempArr[j].childList[x].nihCpsiTitle + '</span></p>\
                                                <div class="optionBox">\
                                                <span>否</span>\
                                                <span class="active">是</span>\
                                                </div>\
                                            </div>\
                                            <div class="solutionBox">\
                                                <p class="titleText">解读：</p>\
                                                <div class="optionBox">\
                                                    <span>是: 1分</span>\
                                                    <span>否: 0分</span>\
                                                </div>\
                                            </div>\
                                        </div>'
                                    }
                                } else {
                                    // 多项选择
                                    _html += '<div class="topicItem">\
                                        <div class="topicBox">\
                                            <p><span class="num"></span><span>' + tempArr[j].nihCpsiTitle + '</span></p>\
                                            <div class="optionBox">';
                                    for (var z = 0; z < tempArr[j].childList.length; z++) {
                                        _html += '<span>' + tempArr[j].childList[z].nihCpsiTitle + '</span>';
                                    }
                                    _html += '</div>\
                                        </div>\
                                        <div class="solutionBox">\
                                            <p class="titleText">解读：</p>\
                                            <div class="optionBox">';
                                    for (var z = 0; z < tempArr[j].childList.length; z++) {
                                        _html += '<span>' + tempArr[j].childList[z].nihCpsiTitle + ': ' + tempArr[j].childList[z].nihCpsiScore + '分</span>';
                                    }
                                    _html += '</div>\
                                        </div>\
                                    </div>';
                                }
                            }
                        } else if (dataArr[i].nihCpsiType == 'b') {
                            var tempArr = dataArr[i].childList;
                            // 循环分别 单项选择 还是 多项选择
                            for (var j = 0; j < tempArr.length; j++) {
                                if (tempArr[j].nihCpsiType == 0) {
                                    // 循环单项选择题
                                    for (var x = 0; x < tempArr[j].childList.length; x++) {
                                        _html += '<div class="topicItem">\
                                            <div class="topicBox">\
                                                <p><span class="num"></span><span>' + tempArr[j].childList[x].nihCpsiTitle + '</span></p>\
                                                <div class="optionBox">\
                                                <span>否</span>\
                                                <span class="active">是</span>\
                                                </div>\
                                            </div>\
                                            <div class="solutionBox">\
                                                <p class="titleText">解读：</p>\
                                                <div class="optionBox">\
                                                    <span>是: 1分</span>\
                                                    <span>否: 0分</span>\
                                                </div>\
                                            </div>\
                                        </div>'
                                    }
                                } else {
                                    // 多项选择
                                    _html += '<div class="topicItem">\
                                        <div class="topicBox">\
                                            <p><span class="num"></span><span>' + tempArr[j].nihCpsiTitle + '</span></p>\
                                            <div class="optionBox">';
                                    for (var z = 0; z < tempArr[j].childList.length; z++) {
                                        _html += '<span>' + tempArr[j].childList[z].nihCpsiTitle + '</span>';
                                    }
                                    _html += '</div>\
                                        </div>\
                                        <div class="solutionBox">\
                                            <p class="titleText">解读：</p>\
                                            <div class="optionBox">';
                                    for (var z = 0; z < tempArr[j].childList.length; z++) {
                                        _html += '<span>' + tempArr[j].childList[z].nihCpsiTitle + ': ' + tempArr[j].childList[z].nihCpsiScore + '分</span>';
                                    }
                                    _html += '</div>\
                                        </div>\
                                    </div>';
                                }
                            }
                        } else if (dataArr[i].nihCpsiType == 'c') {
                            var tempArr = dataArr[i].childList;
                            // 循环分别 单项选择 还是 多项选择
                            for (var j = 0; j < tempArr.length; j++) {
                                if (tempArr[j].nihCpsiType == 0) {
                                    // 循环单项选择题
                                    for (var x = 0; x < tempArr[j].childList.length; x++) {
                                        _html += '<div class="topicItem">\
                                            <div class="topicBox">\
                                                <p><span class="num"></span><span>' + tempArr[j].childList[x].nihCpsiTitle + '</span></p>\
                                                <div class="optionBox">\
                                                <span>否</span>\
                                                <span class="active">是</span>\
                                                </div>\
                                            </div>\
                                            <div class="solutionBox">\
                                                <p class="titleText">解读：</p>\
                                                <div class="optionBox">\
                                                    <span>是: 1分</span>\
                                                    <span>否: 0分</span>\
                                                </div>\
                                            </div>\
                                        </div>'
                                    }
                                } else {
                                    // 多项选择
                                    _html += '<div class="topicItem">\
                                        <div class="topicBox">\
                                            <p><span class="num"></span><span>' + tempArr[j].nihCpsiTitle + '</span></p>\
                                            <div class="optionBox">';
                                    for (var z = 0; z < tempArr[j].childList.length; z++) {
                                        _html += '<span>' + tempArr[j].childList[z].nihCpsiTitle + '</span>';
                                    }
                                    _html += '</div>\
                                        </div>\
                                        <div class="solutionBox">\
                                            <p class="titleText">解读：</p>\
                                            <div class="optionBox">';
                                    for (var z = 0; z < tempArr[j].childList.length; z++) {
                                        _html += '<span>' + tempArr[j].childList[z].nihCpsiTitle + ': ' + tempArr[j].childList[z].nihCpsiScore + '分</span>';
                                    }
                                    _html += '</div>\
                                        </div>\
                                    </div>';
                                }
                            }
                        }
                    }
                    $('.topicContent').html(_html);
                    var objArr = $('.topicItem');
                    for (var i = 0; i < optionScore.length; i++) {
                        $('.topicItem').eq(i).find('.topicBox .optionBox > span').removeClass('active').eq(optionScore[i]).addClass('active');
                    }
                } else {
                    $('.topicContent').html('');
                }
            },
            error: function (err) {
                console.log(err);
            },
        })

    } else {
        var optionScore = [];
        // 前列腺 ipss 增生答案
        $.ajax({
            headers: {
                token:myLocal.getItem("token"),
            },
            type: 'POST',
            url: IP + '/api-assessmen/patientIpssScore/getById',
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json',
            data: {
                "ipssScoreId": myLocal.getItem('scoreId'),
            },
            async: false,
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    optionScore = data.result.optionScore.split('-');
                } else {

                }
            },
            error: function (err) {
                console.log(err);
            },
        })
        // 前列腺 ipss 增生题目
        $.ajax({
            headers: {
                token:myLocal.getItem("token"),
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
                    var _html = '';
                    // 循环分别不同类型的题
                    for (var i = 0; i < dataArr.length; i++) {
                        if (dataArr[i].ipssType == 'a') {
                            var tempArr = dataArr[i].childList;
                            // 循环分别 单项选择 还是 多项选择
                            for (var j = 0; j < tempArr.length; j++) {
                                if (tempArr[j].ipssType == 0) {
                                    // 循环单项选择题
                                    for (var x = 0; x < tempArr[j].childList.length; x++) {
                                        _html += '<div class="topicItem">\
                                            <div class="topicBox">\
                                                <p><span class="num"></span><span>' + tempArr[j].childList[x].ipssTitle + '</span></p>\
                                                <div class="optionBox">\
                                                <span>否</span>\
                                                <span class="active">是</span>\
                                                </div>\
                                            </div>\
                                            <div class="solutionBox">\
                                                <p class="titleText">解读：</p>\
                                                <div class="optionBox">\
                                                    <span>是: 1分</span>\
                                                    <span>否: 0分</span>\
                                                </div>\
                                            </div>\
                                        </div>'
                                    }
                                } else {
                                    // 多项选择
                                    _html += '<div class="topicItem">\
                                        <div class="topicBox">\
                                            <p><span class="num"></span><span>' + tempArr[j].ipssTitle + '</span></p>\
                                            <div class="optionBox">';
                                    for (var z = 0; z < tempArr[j].childList.length; z++) {
                                        _html += '<span>' + tempArr[j].childList[z].ipssTitle + '</span>';
                                    }
                                    _html += '</div>\
                                        </div>\
                                        <div class="solutionBox">\
                                            <p class="titleText">解读：</p>\
                                            <div class="optionBox">';
                                    for (var z = 0; z < tempArr[j].childList.length; z++) {
                                        _html += '<span>' + tempArr[j].childList[z].ipssTitle + ': ' + tempArr[j].childList[z].ipssScore + '分</span>';
                                    }
                                    _html += '</div>\
                                        </div>\
                                    </div>';
                                }
                            }
                        } else if (dataArr[i].ipssType == 'b') {
                            var tempArr = dataArr[i].childList;
                            // 循环分别 单项选择 还是 多项选择
                            for (var j = 0; j < tempArr.length; j++) {
                                if (tempArr[j].ipssType == 0) {
                                    // 循环单项选择题
                                    for (var x = 0; x < tempArr[j].childList.length; x++) {
                                        _html += '<div class="topicItem">\
                                            <div class="topicBox">\
                                                <p><span class="num"></span><span>' + tempArr[j].childList[x].ipssTitle + '</span></p>\
                                                <div class="optionBox">\
                                                <span>否</span>\
                                                <span class="active">是</span>\
                                                </div>\
                                            </div>\
                                            <div class="solutionBox">\
                                                <p class="titleText">解读：</p>\
                                                <div class="optionBox">\
                                                    <span>是: 1分</span>\
                                                    <span>否: 0分</span>\
                                                </div>\
                                            </div>\
                                        </div>'
                                    }
                                } else {
                                    // 多项选择
                                    _html += '<div class="topicItem">\
                                        <div class="topicBox">\
                                            <p><span class="num"></span><span>' + tempArr[j].ipssTitle + '</span></p>\
                                            <div class="optionBox">';
                                    for (var z = 0; z < tempArr[j].childList.length; z++) {
                                        _html += '<span>' + tempArr[j].childList[z].ipssTitle + '</span>';
                                    }
                                    _html += '</div>\
                                        </div>\
                                        <div class="solutionBox">\
                                            <p class="titleText">解读：</p>\
                                            <div class="optionBox">';
                                    for (var z = 0; z < tempArr[j].childList.length; z++) {
                                        _html += '<span>' + tempArr[j].childList[z].ipssTitle + ': ' + tempArr[j].childList[z].ipssScore + '分</span>';
                                    }
                                    _html += '</div>\
                                        </div>\
                                    </div>';
                                }
                            }
                        } else if (dataArr[i].ipssType == 'c') {
                            var tempArr = dataArr[i].childList;
                            // 循环分别 单项选择 还是 多项选择
                            for (var j = 0; j < tempArr.length; j++) {
                                if (tempArr[j].ipssType == 0) {
                                    // 循环单项选择题
                                    for (var x = 0; x < tempArr[j].childList.length; x++) {
                                        _html += '<div class="topicItem">\
                                            <div class="topicBox">\
                                                <p><span class="num"></span><span>' + tempArr[j].childList[x].ipssTitle + '</span></p>\
                                                <div class="optionBox">\
                                                    <span>否</span>\
                                                    <span class="active">是</span>\
                                                </div>\
                                            </div>\
                                            <div class="solutionBox">\
                                                <p class="titleText">解读：</p>\
                                                <div class="optionBox">\
                                                    <span>是: 1分</span>\
                                                    <span>否: 0分</span>\
                                                </div>\
                                            </div>\
                                        </div>'
                                    }
                                } else {
                                    // 多项选择
                                    _html += '<div class="topicItem">\
                                        <div class="topicBox">\
                                            <p><span class="num"></span><span>' + tempArr[j].ipssTitle + '</span></p>\
                                            <div class="optionBox">';
                                    for (var z = 0; z < tempArr[j].childList.length; z++) {
                                        _html += '<span>' + tempArr[j].childList[z].ipssTitle + '</span>';
                                    }
                                    _html += '</div>\
                                        </div>\
                                        <div class="solutionBox">\
                                            <p class="titleText">解读：</p>\
                                            <div class="optionBox">';
                                    for (var z = 0; z < tempArr[j].childList.length; z++) {
                                        _html += '<span>' + tempArr[j].childList[z].ipssTitle + ': ' + tempArr[j].childList[z].ipssScore + '分</span>';
                                    }
                                    _html += '</div>\
                                        </div>\
                                    </div>';
                                }
                            }
                        }
                    }
                    $('.topicContent').html(_html);
                    var objArr = $('.topicItem');
                    for (var i = 0; i < optionScore.length; i++) {
                        $('.topicItem').eq(i).find('.topicBox .optionBox > span').removeClass('active').eq(optionScore[i]).addClass('active');
                    }
                } else {
                    answerArr = [];
                }
            },
            error: function (err) {
                console.log(err);
            },
        })

    }
})
