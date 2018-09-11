$(function () {
    // 自测评估
    $('.assess').click(function () {
        // 判断用户信息
        if (!myLocal.getItem('userInfo')) {
            window.location = '/chestnut/newrecord/newrecord.html'
        } else if (myLocal.getItem('userInfo') && myLocal.getItem('userInfo').patientAge) {
            // 答题
            window.location = '/chestnut/answer/answer.html'
        } else {
            // 基本信息
            window.location = '/chestnut/infoEntry/infoEntry.html'
        }
    });

    // 解读化验单
    $('.assay').click(function () {
        // 判断是否有年龄
        if (!myLocal.getItem('userInfo')) {
            window.location = '/chestnut/newrecord/newrecord.html'
        } else if (myLocal.getItem('userInfo') && myLocal.getItem('userInfo').patientAge) {
            window.location = '/chestnut/assay/assay.html';
        } else {
            layer.msg('请去个人中心完善年龄');
        }
    })
})
