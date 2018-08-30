$(function () {
    $.ajax({
        headers: {
            token:myLocal.getItem("token"),
        },
        type: 'GET',
        url: IP + '/api-assessmen/medicalExamination/getByPatientId',
        xhrFields: {
            withCredentials: true
        },
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log(data)
            if (data.code == 20000) {
                var _html = '';
                for (var year in data.result) {
                    var oneHtml = '';
                    var monthArr = data.result[year];
                    for (var month in monthArr) {
                        var twoHtml = '';
                        twoHtml = '<h3><span class="month">' + month + '月</span>|<span class="countBox">解读次数：<i class="count">' + monthArr[month].length + '</i>次</span></h3>';
                        var itemArr = monthArr[month];
                        for (var i = 0; i < itemArr.length; i++) {
                            var _year = itemArr[i].createTime.split(' ')[0];
                            var _time = itemArr[i].createTime.split(' ')[1];
                            var _labelHtml = '';
                            if (itemArr[i].bloodRoutineRemark != "") {
                                _labelHtml += ' 血常规 /'
                            }
                            if (itemArr[i].urineRoutineRemark != "") {
                                _labelHtml += ' 尿常规 /'
                            }
                            if (itemArr[i].expressedProstaticSecretionRemark != "") {
                                _labelHtml += ' 前列腺按摩液 /'
                            }
                            if (itemArr[i].specificAntigenRemark != "") {
                                _labelHtml += ' 特异性抗原 /'
                            }
                            if (itemArr[i].ultrasonographyBRemark != "") {
                                _labelHtml += ' B超报告单 /'
                            }
                            if (itemArr[i].digitalRectalRemark != "") {
                                _labelHtml += ' 前列腺指诊 /'
                            }
                            if (itemArr[i].urineFlowRateRemark != "") {
                                _labelHtml += ' 尿流率 /'
                            }
                            twoHtml += "<a class='unscrambleItem' data='" + JSON.stringify(itemArr[i]) + "' href='javascript:;'>"
                            twoHtml += '<div class="content">\
                                    <p class="date">' + _year + '</p>\
                                    <p class="text">' + _labelHtml + '</p>\
                                </div>\
                                <div class="btnBox">详情</div>\
                            </a>';
                        }
                        oneHtml = twoHtml + oneHtml;
                    }
                    _html = '<h2>' + year + '年份</h2>' + oneHtml + _html;
                }
                $('.content').html(_html);
            } else {

            }
        },
        error: function (err) {
            console.log(err);
        },
    })
    $('.content').delegate('.unscrambleItem', 'click', function () {
        myLocal.setItem('results', $(this).attr("data"));
        window.location = '/chestnut/results/results.html';
    });
})
