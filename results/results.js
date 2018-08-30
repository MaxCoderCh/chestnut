$(function() {
    var dataJson = myLocal.getItem('results');
    if (dataJson.id == undefined) {
        dataJson = JSON.parse(dataJson);
    }
    $('.summarizeText').html(dataJson.medicalExaminationRemark);
    var tabHtml = '';
    var contentHtml = '';
    if (dataJson.bloodRoutineRemark) {
        tabHtml += '<li><a href="javascript:;">血常规</a></li>';
        contentHtml += '<h3>血常规</h3>\
        <div class="otherItem">\
            <span></span>\
            <p>' + dataJson.bloodRoutineRemark + ';</p>\
        </div>'
    }
    if (dataJson.urineRoutineRemark) {
        tabHtml += '<li><a href="javascript:;">尿常规</a></li>';
        contentHtml += '<h3>尿常规</h3>\
        <div class="otherItem">\
            <span></span>\
            <p>' + dataJson.urineRoutineRemark + ';</p>\
        </div>'
    }
    if (dataJson.expressedProstaticSecretionRemark) {
        tabHtml += '<li><a href="javascript:;">前列腺按摩液</a></li>';
        contentHtml += '<h3>前列腺按摩液</h3>\
        <div class="otherItem">\
            <span></span>\
            <p>' + dataJson.expressedProstaticSecretionRemark + ';</p>\
        </div>'
    }
    if (dataJson.specificAntigenRemark) {
        tabHtml += '<li><a href="javascript:;">特异性抗原</a></li>';
        contentHtml += '<h3>特异性抗原</h3>\
        <div class="otherItem">\
            <span></span>\
            <p>' + dataJson.specificAntigenRemark + ';</p>\
        </div>'
    }
    if (dataJson.ultrasonographyBRemark) {
        tabHtml += '<li><a href="javascript:;">B超报告单</a></li>';
        contentHtml += '<h3>B超报告单</h3>\
        <div class="otherItem">\
            <span></span>\
            <p>' + dataJson.ultrasonographyBRemark + ';</p>\
        </div>'
    }
    if (dataJson.digitalRectalRemark) {
        tabHtml += '<li><a href="javascript:;">前列腺指诊</a></li>';
        contentHtml += '<h3>前列腺指诊</h3>\
       <div class="otherItem">\
           <span></span>\
           <p>' + dataJson.digitalRectalRemark + ';</p>\
       </div>'
    }
    if (dataJson.urineFlowRateRemark) {
        tabHtml += '<li><a href="javascript:;">尿流率</a></li>';
        contentHtml += '<h3>尿流率</h3>\
       <div class="otherItem">\
           <span></span>\
           <p>' + dataJson.urineFlowRateRemark + ';</p>\
       </div>'
    }
    if (tabHtml == '') {
        $('.subdivideContent').hide();
    }
    $('.subdivideTabBox').html(tabHtml);
    $('.subdivideMain').html(contentHtml);
    var _width = 0;
    var tabObjArr = $('.subdivideTabBox > li');
    for (var i = 0; i < tabObjArr.length; i++) {
        _width += tabObjArr.eq(i).outerWidth(true) + parseInt(tabObjArr.eq(i).css('marginLeft')) * 2;
    }
    $('.subdivideTabBox').css('width', _width + 'px');
    $('.subdivideTabBox > li').eq(0).addClass('active');

    // tab切换 控制 内容滚动
    $('.subdivideTabBox').delegate('li', 'click', function() {
        var _index = $(this).index();
        $(this).addClass('active').siblings('li').removeClass('active');
        $(".subdivideMainContent").animate({
            scrollTop: $('.subdivideMain > h3').eq(_index).offset().top - $('.subdivideMainContent').offset().top + $('.subdivideMainContent').scrollTop()
        }, 100);
    });
    // 内容滚动 控制 tab 切换
    // $('.subdivideMainContent').scroll(function() {
    //     if ($('.subdivideMainContent').scrollTop() > $('.subdivideMain > h3').eq(0).offset().top) {
    //         $('.subdivideTabBox > li').removeClass('active').eq(1).addClass('active');
    //     } else {
    //         $('.subdivideTabBox > li').removeClass('active').eq(0).addClass('active');
    //     }
    //     if ($('.subdivideMainContent').scrollTop() - $('.subdivideMain > h3').eq(0).offset().top > $('.subdivideMain > h3').eq(1).offset().top) {
    //         $('.subdivideTabBox > li').removeClass('active').eq(2).addClass('active');
    //     } else {
    //         $('.subdivideTabBox > li').removeClass('active').eq(1).addClass('active');
    //     }
    //     if ($('.subdivideMainContent').scrollTop() - $('.subdivideMain > h3').eq(1).offset().top > $('.subdivideMain > h3').eq(2).offset().top) {
    //         $('.subdivideTabBox > li').removeClass('active').eq(3).addClass('active');
    //     }
    //     if ($('.subdivideMainContent').scrollTop() - $('.subdivideMain > h3').eq(2).offset().top > $('.subdivideMain > h3').eq(3).offset().top) {
    //         $('.subdivideTabBox > li').removeClass('active').eq(4).addClass('active');
    //     }
    //     if ($('.subdivideMainContent').scrollTop() - $('.subdivideMain > h3').eq(3).offset().top > $('.subdivideMain > h3').eq(4).offset().top) {
    //         $('.subdivideTabBox > li').removeClass('active').eq(5).addClass('active');
    //     }
    //     if ($('.subdivideMainContent').scrollTop() - $('.subdivideMain > h3').eq(4).offset().top > $('.subdivideMain > h3').eq(5).offset().top) {
    //         $('.subdivideTabBox > li').removeClass('active').eq(6).addClass('active');
    //     }
    // })


    $('.subdivideTabBox').on('touchstart', function(e) {
        if (_width > $('.subdivideTabContent').outerWidth(true)) {
            var x = e.originalEvent.targetTouches[0].pageX - parseInt($('.subdivideTabBox').css('left'));
            $('.subdivideTabBox').on('touchmove', function(e) {
                var newX = e.originalEvent.targetTouches[0].pageX;
                var num = newX - x;
                if (num > 0) {
                    num = 0;
                }
                if (num <= $('.subdivideTabContent').width() - _width) {
                    num = $('.subdivideTabContent').width() - _width;
                }
                $('.subdivideTabBox').css({
                    'left': num + 'px',
                });
            })
        }
    })

    $('.subdivideTabBox').on('touchend', function() {
        $('.bigImgBox').unbind('mousemove');
    })
})
