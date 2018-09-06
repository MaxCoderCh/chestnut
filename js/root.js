// var IP = 'http://192.168.0.222';
var IP = 'http://www.qlxlm.com';
var RegExpObj = {
    Reg_IDCardNo: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/, // 身份证
    Reg_TelNo: /^1[3|4|5|7|8]\d{9}$/, // 手机号
    Reg_PassWord: /^(\w){6,16}$/, // 登录密码
    Reg_Number: /^\d{6}$/, // 验证数字
    Reg_Name: /^[\u4e00-\u9fa5]{2,6}$/, //验证名字
    Reg_Text: /[0-9a-zA-Z\u4e00-\u9fa5`~!@#$^&*\\()=|{}':;',\\\\.<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]/,
    Reg_email: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/, //邮箱
};
$(function () {
    if ($('.footer').length > 0) {
        setTimeout(function () {
            if ($('.footer').offset().top + $('.footer').outerHeight(true) > $(window).height()) {
                $('.footer').css('position', 'static');
            } else {
                $('.footer').css('position', 'fixed');
            }
        }, 0)
    }
})
// 版权定位
