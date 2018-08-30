$(function () {
    $.ajax({
        headers: {
            token:myLocal.getItem("token"),
        },
        type: 'GET',
        url: IP + '/api-assessmen/assessment/findByWechatToken',
        xhrFields: {
            withCredentials: true
        },
        dataType: 'json',
        success: function (data) {
            console.log(data)
            if (data.code == 20000) {
                var _html = '';
                var tempArr = data.result;
                for (var i = 0; i < tempArr.length; i++) {
                    _html += '<a class="recordItem" type="' + tempArr[i].scoreType + '" name="' + tempArr[i].id + '" href="javascript:;">\
                        <div class="scoreBox">\
                            <p class="score">' + tempArr[i].totalScore + '</p>\
                            <p class="degree">' + tempArr[i].caution + '</p>\
                        </div>\
                        <div class="descBox">';
                    if (tempArr[i].scoreType == "A") {
                        _html += '<h3>慢性前列腺炎</h3>';
                    } else {
                        _html += '<h3>前列腺增生</h3>';
                    }
                    _html += '<p>评测时间 : ' + tempArr[i].createTime + '</p>\
                        </div>\
                        <img class="arrowRight" src="/chestnut/images/arrowRight.png" alt="">\
                    </a>'
                }
                $('.recordContent').html(_html);
            } else {

            }
        },
        error: function (err) {
            console.log(err);
        },
    })
    $('.recordContent').delegate('.recordItem', 'click', function () {
        myLocal.setItem('scoreId', $(this).attr('name'));
        window.location = '/chestnut/recordInfo/recordInfo.html?' + $(this).attr("type") + '';
    });
})
