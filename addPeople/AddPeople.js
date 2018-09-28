$(function () {
    // 图片压缩 ES6 canvas
    function reduceImg(base64) {
        return new Promise(function (resolve, reject) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var img = new Image();
            img.src = base64;
            // base64地址图片加载完毕后
            img.onload = function () {
                // 图片原始尺寸
                var originWidth = this.width;
                var originHeight = this.height;
                // 最大尺寸限制，可通过国设置宽高来实现图片压缩程度
                var maxWidth = 800,
                    maxHeight = 800;
                // 目标尺寸
                var targetWidth = originWidth,
                    targetHeight = originHeight;
                // 图片尺寸超过400x400的限制
                if (originWidth > maxWidth || originHeight > maxHeight) {
                    if (originWidth / originHeight > maxWidth / maxHeight) {
                        // 更宽，按照宽度限定尺寸
                        targetWidth = maxWidth;
                        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                    } else {
                        targetHeight = maxHeight;
                        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                    }
                }
                // canvas对图片进行缩放
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                // 清除画布
                context.clearRect(0, 0, targetWidth, targetHeight);
                // 图片压缩
                context.drawImage(img, 0, 0, targetWidth, targetHeight);
                /*第一个参数是创建的img对象；第二个参数是左上角坐标，后面两个是画布区域宽高*/
                //压缩后的图片base64 url
                /*canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/jpeg';
                 * qualityArgument表示导出的图片质量，只要导出为jpg和webp格式的时候此参数才有效果，默认值是0.92*/
                //base64 格式
                resolve(canvas.toDataURL('image/jpeg', 0.92));
            }
        })
    }

    // base64 转 file 对象
    function dataURLtoFile(dataurl, filename) {//将base64转换为文件  
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    // file 压缩
    function reduceFile(file) {
        return new Promise(function (resolve, reject) {
            // file 转 base64
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                if (e.target.result) {
                    // base64 进行压缩
                    reduceImg(e.target.result).then(function (newBase64) {
                        // 压缩后的base64 再 转回 file
                        resolve(dataURLtoFile(newBase64, file.name))
                    })
                }
            }
        })
    }

    layui.use('form', function () {
        var form = layui.form;
        form.render();
    });
    var patientInfo = {};
    var flag = true;// 是否是新建的
    var drugAllergyArr = [];
    var illnessAddArr = [];
    var surgeryAddArr = [];
    var eatingDrugAddArr = [];

    $(".fileBtn").click(function () {
        if (!flag) {
            layer.msg("不能修改");
            return false;
        }
    })
    // 根据患者id获取患者信息
    function getPatientById(patientId) {
        $.ajax({
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'GET',
            url: IP + '/api-record/patientAnamnesis/getPatientById?patientId=' + patientId,
            dataType: 'json',
            async: false,
            success: function (data) {
                console.log(data)
                if (data.code == '20000') {
                    // flag 是否第一次建立该患者，false数据库中存在过该患者
                    flag = false;
                    patientInfo = data.result;
                    myLocal.setItem("patientInfo", data.result);
                    $(".doctorName").html(data.result.patientName);
                    $(".sex").html(data.result.patientSex);
                    $(".age").html(data.result.patientAge + '岁');
                    $(".idNumber").html(data.result.patientCard);
                    $(".patientSource").val(data.result.patientSource);
                    if (data.result.patientSource == "自己") {
                        $(".patientSource").html('<option value="自己">自己</option>');
                    }
                    layui.use('form', function () {
                        var form = layui.form;
                        form.render();
                    });
                    // 渲染疾病信息
                    renderIllness();
                }
            },
            error: function (err) {
                console.log(err)
            },
        });
    }
    // 获取身份证图片路径 - start
    $(".fileBtn").change(function () {
        layer.open({
            title: '',
            type: 1,
            content: $('.loadingContainer'),
            closeBtn: false,
            shadeClose: false,
            skin: 'noBackground',
        });
        reduceFile($(this)[0].files[0]).then(function (newFile) {
            var postData = new FormData();
            postData.append("recordType", "person-card");
            postData.append("file", newFile);
            $.ajax({
                headers: {
                    token: myLocal.getItem("token"),
                },
                type: 'POST',
                url: IP + '/api-third/cos/upload',
                xhrFields: {
                    withCredentials: true,
                },
                processData: false,
                contentType: false,
                data: postData,
                dataType: 'json',
                success: function (data) {
                    console.log(data)
                    if (data.code == 20000) {
                        $.ajax({
                            headers: {
                                Accept: "application/json; charset=utf-8",
                                token: myLocal.getItem("token"),
                            },
                            type: 'POST',
                            url: IP + '/api-record/patient/add',
                            xhrFields: {
                                withCredentials: true,
                            },
                            data: {
                                "idCardUrl": data.result,
                            },
                            dataType: 'json',
                            success: function (data) {
                                console.log(data)
                                layer.closeAll();
                                $(".loadingContainer").hide();
                                if (data.code == 20000) {
                                    patientInfo = data.result;
                                    $(".doctorName").html(data.result.patientName);
                                    $(".sex").html(data.result.patientSex);
                                    $(".age").html(data.result.patientAge + '岁');
                                    $(".idNumber").html(data.result.patientCard);
                                    // 通过id查患者详情
                                    getPatientById(patientInfo.id);
                                } else if (data.code == '50000') {
                                    layer.msg('图片识别失败');
                                } else {
                                    layer.msg('图片识别失败');
                                }
                            },
                            error: function (err) {
                                console.log(err);
                            },
                        })
                    } else {
                        layer.msg('图片上传失败');
                    }
                },
                error: function (err) {
                    console.log(err);
                },
            })
        })
    })
    // 获取身份证图片路径 - end
    if (myLocal.getItem('patientInfo')) {
        // 从编辑就诊人来,修改就诊人信息
        getPatientById(myLocal.getItem("patientInfo").id);
    }



    function deleteIllness(obj, id) {
        $.ajax({
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'POST',
            url: IP + '/api-record/anamnesis/delete',
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json',
            data: {
                "id": id,
                "patientId": patientInfo.id,
            },
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    obj.remove();
                } else {

                }
            },
            error: function (err) {
                console.log(err);
            },
        })
    }


    // 输入框焦点效果切换
    $('.illnessSearch').focus(function () {
        $(this).parents('.medicalItem').addClass('active').siblings('div').removeClass('active');
        $(this).parents('.medicalItem').siblings('div').find('.selectUl').hide();
        $(this).parents('.medicalItem').siblings('div').find('.illnessSearch').val('');
    }).blur(function () {
        $(this).parents('.medicalItem').removeClass('active');
    });
    // 过敏药物
    $('.drugAllergy').on('input', function (e) {
        $.ajax({
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'POST',
            url: IP + '/api-stata/anamnesisAllergyDrug/search',
            dataType: 'json',
            data: {
                "spellName": $('.drugAllergy').val(),
            },
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    var arr = data.result;
                    var _html = '';
                    for (var i = 0; i < arr.length; i++) {
                        _html += '<li class="selectItem" name="' + arr[i].id + '">' + arr[i].allergyDrugName + '</li>'
                    }
                    $('.drugAllergyAdd').show().html(_html);
                } else {
                    $('.drugAllergyAdd').hide();
                }
            },
            error: function (err) {

            },
        });
    })
    $(".drugAllergyAdd").delegate("li", "click", function () {
        if (drugAllergyArr.indexOf($(this).attr('name')) == -1) {
            $('.drugAllergyUl').css("display", 'flex');
            drugAllergyArr.push($(this).attr('name'));
            $(this).clone(true).appendTo(".drugAllergyUl");
            $(".drugAllergyAdd").hide();
            $('.drugAllergy').val("");
        }
    });

    // 删除过敏药物

    $('.drugAllergyUl').delegate('li', "click", function () {
        if ($(this).attr('type') == 'old') {
            deleteIllness($(this), $(this).attr('name'));
        } else {
            $(this).remove();
        }
        drugAllergyArr.splice(drugAllergyArr.indexOf($(this).attr('name')), 1);
        if (drugAllergyArr.length <= 0) {
            $('.drugAllergyUl').hide();
        }

    })

    // 既往病史
    $('.illnessInput').on('input', function (e) {
        $.ajax({
            type: 'POST',
            url: IP + '/api-stata/anamnesisIllness/search',
            dataType: 'json',
            data: {
                "token": myLocal.getItem('token'),
                "spellName": $('.illnessInput').val(),
            },
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    var arr = data.result;
                    var _html = '';
                    for (var i = 0; i < arr.length; i++) {
                        _html += '<li name="' + arr[i].id + '">' + arr[i].anamnesisIllnessName + '</li>'
                    }
                    $('.illnessAdd').show().html(_html);
                } else {
                    $('.illnessAdd').hide();
                }
            },
            error: function (err) {

            },
        });
    })
    $(".illnessAdd").delegate("li", "click", function () {
        if (illnessAddArr.indexOf($(this).attr('name')) == -1) {
            $(".illnessUl").css('display', 'flex');
            illnessAddArr.push($(this).attr('name'));
            $(this).clone(true).appendTo(".illnessUl");
            $(".illnessAdd").hide();
            $('.illnessInput').val("");
        }
    });
    $('.illnessUl').delegate('li', "click", function () {
        console.log(illnessAddArr.length)
        if ($(this).attr('type') == 'old') {
            deleteIllness($(this), $(this).attr('name'));
        } else {
            $(this).remove();
        }
        illnessAddArr.splice(illnessAddArr.indexOf($(this).attr('name')), 1);
        if (illnessAddArr.length <= 0) {
            $('.illnessUl').hide();
        }
    })
    // 手术病
    $('.surgeryInput').on('input', function (e) {
        $.ajax({
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'POST',
            url: IP + '/api-stata/surgicalHistory/search',
            dataType: 'json',
            data: {
                "spellName": $('.surgeryInput').val(),
            },
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    var arr = data.result;
                    var _html = '';
                    for (var i = 0; i < arr.length; i++) {
                        _html += '<li name="' + arr[i].id + '">' + arr[i].surgicalHistoryName + '</li>'
                    }
                    $('.surgeryAdd').show().html(_html);
                } else {
                    $('.surgeryAdd').hide();
                }
            },
            error: function (err) {

            },
        });
    });
    $(".surgeryAdd").delegate("li", "click", function () {
        if (surgeryAddArr.indexOf($(this).attr('name')) == -1) {
            $(".surgeryUl").css('display', 'flex');
            surgeryAddArr.push($(this).attr('name'));
            $(this).clone(true).appendTo(".surgeryUl");
            $(".surgeryAdd").hide();
            $('.surgeryInput').val("");
        }
    });
    $('.surgeryUl').delegate('li', "click", function () {
        if ($(this).attr('type') == 'old') {
            deleteIllness($(this), $(this).attr('name'));
        } else {
            $(this).remove();
        }
        surgeryAddArr.splice(surgeryAddArr.indexOf($(this).attr('name')), 1);
        if (surgeryAddArr.length <= 0) {
            $('.surgeryUl').hide();
        }
    })
    // 正在服用的药物
    $('.eatingDrugInput').on('input', function (e) {
        $.ajax({
            headers: {
                token: myLocal.getItem("token"),
            },
            type: 'POST',
            url: IP + '/api-stata/anamnesisEatingDrug/search',
            dataType: 'json',
            data: {
                "spellName": $('.eatingDrugInput').val(),
            },
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    var arr = data.result;
                    var _html = '';
                    for (var i = 0; i < arr.length; i++) {
                        _html += '<li name="' + arr[i].id + '">' + arr[i].eatingDrugName + '</li>'
                    }
                    $('.eatingDrugAdd').show().html(_html);
                } else {
                    $('.eatingDrugAdd').hide();
                }
            },
            error: function (err) {

            },
        });
    })
    $(".eatingDrugAdd").delegate("li", "click", function () {
        if (eatingDrugAddArr.indexOf($(this).attr('name')) == -1) {
            $('.eatingDrugUl').css('display', 'flex');
            eatingDrugAddArr.push($(this).attr('name'));
            $(this).clone(true).appendTo(".eatingDrugUl");
            $(".eatingDrugAdd").hide();
            $('.eatingDrugInput').val("");
        }
    });
    $('.eatingDrugUl').delegate('li', "click", function () {
        if ($(this).attr('type') == 'old') {
            deleteIllness($(this), $(this).attr('name'));
        } else {
            $(this).remove();
        }
        eatingDrugAddArr.splice(eatingDrugAddArr.indexOf($(this).attr('name')), 1);
        if (eatingDrugAddArr.length <= 0) {
            $('.eatingDrugUl').hide();
        }
    })
    // 渲染疾病信息
    function renderIllness() {
        // 添加过敏病
        drugAllergyArr = [];
        var drugAllergyTemp = myLocal.getItem('patientInfo') && myLocal.getItem('patientInfo').anamnesisAllergyDrugList ? myLocal.getItem('patientInfo').anamnesisAllergyDrugList : [];
        drugAllergyTemp.length > 0 ? $('.drugAllergyUl').css("display", 'flex') : null;
        var _drugAllergyHtml = '';
        for (var i = 0; i < drugAllergyTemp.length; i++) {
            drugAllergyArr.push(drugAllergyTemp[i].orderId);
            _drugAllergyHtml += '<li class="selectItem" type="old" orderId="' + drugAllergyTemp[i].orderId + '" name="' + drugAllergyTemp[i].id + '">' + drugAllergyTemp[i].anamnesisRemark + '</li>';
        };
        $('.drugAllergyUl').html(_drugAllergyHtml);

        illnessAddArr = [];
        var illnessTemp = myLocal.getItem('patientInfo') && myLocal.getItem('patientInfo').anamnesisIllnessList ? myLocal.getItem('patientInfo').anamnesisIllnessList : [];
        illnessTemp.length > 0 ? $('.illnessUl').css("display", 'flex') : null;
        var _illnessHtml = '';
        for (var i = 0; i < illnessTemp.length; i++) {
            illnessAddArr.push(illnessTemp[i].orderId);
            _illnessHtml += '<li class="selectItem" type="old" orderId="' + illnessTemp[i].orderId + '" name="' + illnessTemp[i].id + '">' + illnessTemp[i].anamnesisRemark + '</li>';
        };
        $(".illnessUl").html(_illnessHtml);

        surgeryAddArr = [];
        var surgeryTemp = myLocal.getItem('patientInfo') && myLocal.getItem('patientInfo').anamnesisSurgicalHistoryList ? myLocal.getItem('patientInfo').anamnesisSurgicalHistoryList : [];
        surgeryTemp.length > 0 ? $('.surgeryUl').css("display", 'flex') : null;
        var _surgeryHtml = '';
        for (var i = 0; i < surgeryTemp.length; i++) {
            surgeryAddArr.push(surgeryTemp[i].orderId);
            _surgeryHtml += '<li class="selectItem" type="old" orderId="' + surgeryTemp[i].orderId + '" name="' + surgeryTemp[i].id + '">' + surgeryTemp[i].anamnesisRemark + '</li>';
        };
        $(".surgeryUl").html(_surgeryHtml);

        eatingDrugAddArr = [];
        var eatingDrugTemp = myLocal.getItem('patientInfo') && myLocal.getItem('patientInfo').anamnesisEatingDrugList ? myLocal.getItem('patientInfo').anamnesisEatingDrugList : [];
        eatingDrugTemp.length > 0 ? $('.eatingDrugUl').css("display", 'flex') : null;
        var _eatingDrugHtml = '';
        for (var i = 0; i < eatingDrugTemp.length; i++) {
            eatingDrugAddArr.push(eatingDrugTemp[i].orderId);
            _eatingDrugHtml += '<li class="selectItem" type="old" orderId="' + eatingDrugTemp[i].orderId + '" name="' + eatingDrugTemp[i].id + '">' + eatingDrugTemp[i].anamnesisRemark + '</li>';
        };
        $(".eatingDrugUl").html(_eatingDrugHtml);
    }



    // 配偶 子女 父母 自己 其他
    $(".submitBtn").click(function () {
        // 添加就诊人
        if (!patientInfo) {
            layer.msg("请先上传身份证");
        } else {
            if (flag) {
                // 新建就诊人
                $.ajax({
                    headers: {
                        Accept: "application/json; charset=utf-8",
                        token: myLocal.getItem("token"),
                    },
                    type: 'POST',
                    url: IP + '/api-record/healthArchive/add',
                    xhrFields: {
                        withCredentials: true,
                    },
                    data: {
                        "patientId": patientInfo.id,
                        "anamnesisAllergyDrugIds": drugAllergyArr.toString(),//过敏药物ID数组
                        "anamnesisIllnessIds": illnessAddArr.toString(),//病史疾病ID
                        "anamnesisEatingDrugIds": eatingDrugAddArr.toString(),//正在服用药物ID数组
                        "anamnesisSurgicalHistoryIds": surgeryAddArr.toString(),//手术史ID数组
                        "patientSource": $(".patientSource").val(),
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        if (data.code == 20000) {
                            window.location.href = document.referrer;
                        } else if (data.code == '50000') {

                        } else {
                            layer.msg("保存失败");
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                })
            } else {
                // 修改就诊人
                $.ajax({
                    headers: {
                        Accept: "application/json; charset=utf-8",
                        token: myLocal.getItem("token"),
                    },
                    type: 'POST',
                    url: IP + '/api-record/anamnesis/update',
                    xhrFields: {
                        withCredentials: true,
                    },
                    data: {
                        "patientId": patientInfo.id,
                        "anamnesisAllergyDrugIds": drugAllergyArr.toString(),//过敏药物ID数组
                        "anamnesisIllnessIds": illnessAddArr.toString(),//病史疾病ID
                        "anamnesisEatingDrugIds": eatingDrugAddArr.toString(),//正在服用药物ID数组
                        "anamnesisSurgicalHistoryIds": surgeryAddArr.toString(),//手术史ID数组
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        if (data.code == 20000) {
                            layer.msg("修改成功");
                            setTimeout(function () {
                                window.location.href = document.referrer;
                            }, 1000)
                        } else if (data.code == '50000') {

                        } else {
                            layer.msg("修改失败");
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                })
                $.ajax({
                    headers: {
                        Accept: "application/json; charset=utf-8",
                        token: myLocal.getItem("token"),
                    },
                    type: 'POST',
                    url: IP + '/api-record/userPatient/update',
                    xhrFields: {
                        withCredentials: true,
                    },
                    data: {
                        "patientId": patientInfo.id,
                        "patientSource": $(".patientSource").val(),
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                    },
                    error: function (err) {
                        console.log(err);
                    },
                })
            }
        }
    })
})
