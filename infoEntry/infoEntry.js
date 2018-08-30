$(function () {
    // 职业列表查询
    $.ajax({
        headers: {
            token:myLocal.getItem("token"),
        },
        type: 'GET',
        url: IP + '/api-stata/profession/getAll',
        dataType: 'json',
        success: function (data) {
            console.log(data)
            if (data.code == '20000') {
                var tempArr = data.result;
                var _html = '';
                for (var i = 0; i < tempArr.length; i++) {
                    if (myLocal.getItem('userInfo') && myLocal.getItem('userInfo').professionName) {
                        if (myLocal.getItem('userInfo').professionName == tempArr[i].professionName) {
                            _html += '<a name="' + tempArr[i].id + '" class="active professionItem">' + tempArr[i].professionName + '</a>'
                        } else {
                            _html += '<a name="' + tempArr[i].id + '" class="professionItem">' + tempArr[i].professionName + '</a>'
                        }
                    } else {
                        if (tempArr[i].professionName == '其它') {
                            _html += '<a name="' + tempArr[i].id + '" class="active professionItem">' + tempArr[i].professionName + '</a>'
                        } else {
                            _html += '<a name="' + tempArr[i].id + '" class="professionItem">' + tempArr[i].professionName + '</a>'
                        }
                    }
                }
                $('.professionBox').html(_html);
            } else {
                $('.professionBox').html('');
            }
        },
        error: function (err) {
            console.log(err)
        },
    });

    // 职业选择
    $('.professionBox').delegate('a', 'click', function () {
        $(this).addClass('active').siblings('a').removeClass('active');
    });
    if (myLocal.getItem('userInfo')) {
        $('.userName').val(myLocal.getItem('userInfo').patientName);
        $('.sex').val(myLocal.getItem('userInfo').patientSex);
        $('.age').val(myLocal.getItem('userInfo').patientAge);
        $('.height').val(myLocal.getItem('userInfo').patientHeight);
        $('.weight').val(myLocal.getItem('userInfo').patientWeight);
    }

    if (myLocal.getItem('userInfo') && myLocal.getItem('userInfo').id) {
        $('.startBtn').addClass('active');
    } else {
        $('.startBtn').removeClass('active');
    }
    // 开始测评按钮
    $('.startBtn').click(function () {
        if ($(this).hasClass('active')) {
            // 修改数据接口
            if ($('.age').val() == '') {
                layer.msg('请输入您的年龄');
            } else {
                $.ajax({
                    headers: {
                        token:myLocal.getItem("token"),
                    },
                    type: 'POST',
                    url: IP + '/api-record/patient/update',
                    dataType: 'json',
                    data: {
                        "id": myLocal.getItem('userInfo').id,
                        "patientName": $('.userName').val(),
                        "patientSex": $('.sex').val(),
                        "patientAge": $('.age').val(),
                        "patientHeight": $('.height').val(),
                        "patientWeight": $('.weight').val(),
                        "professionId": $('.professionBox > a.active').attr('name'),
                    },
                    success: function (data) {
                        console.log(data)
                        if (data.code == '20000') {
                            var obj = myLocal.getItem('userInfo');
                            obj.patientName = $('.userName').val();
                            obj.patientSex = $('.sex').val();
                            obj.patientAge = $('.age').val();
                            obj.patientHeight = $('.height').val();
                            obj.patientWeight = $('.weight').val();
                            obj.professionName = $('.professionBox > a.active').html();
                            myLocal.setItem('userInfo', obj);
                            window.location = '/chestnut/answer/answer.html'
                        } else {

                        }
                    },
                    error: function (err) {
                        console.log(err)
                    },
                });
            }
        }
    })
    $('.skipBtn').click(function () {
        layer.open({
            title: '',
            type: 1,
            content: $('.ageSelect'),
            closeBtn: false,
            shadeClose: false,
        });
    })
    $('.ageSelect').find('.yesBtn').click(function () {
        myLocal.setItem('ageFlag', 1);
        window.location = '/chestnut/answer/answer.html'
    })
    $('.ageSelect').find('.noBtn').click(function () {
        myLocal.setItem('ageFlag', 0);
        window.location = '/chestnut/answer/answer.html'
    })
})
