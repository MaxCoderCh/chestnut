$(function() {
    $('.infoText').html('<span>' + myLocal.getItem('score') + '</span> <br/> ' + myLocal.getItem('degree').replace('症状','') + '');
    var percent = parseInt(myLocal.getItem('score') / 43 * 100);
    if (percent >= 50) {
        var _deg = 360 * percent / 100 - 180 + 45;
        $('.wrapper.rightBox .yuan').css({"transform": "rotate(145deg)"});
        $('.wrapper.leftBox .yuan').css({"transform": "rotate("+_deg+"deg)"});
    } else {
        var _deg = 360 * percent / 100 - 45;
        $('.wrapper.rightBox .yuan').css({"transform": "rotate("+_deg+"deg)"});
    }
    // 症状程度 degree
    var degree = myLocal.getItem('degree').replace('症状','');
    if (window.location.href.split('?')[1] == 'A') {
        $('.result').html(degree + "慢性前列腺炎");
    } else {
        $('.result').html(degree + "前列腺增生");
    }
    $('.detailsBtn').click(function() {
        window.location = '/chestnut/recordInfo/recordInfo.html?'+window.location.href.split('?')[1]+'';
    })
})
