$(function () {
    // 修复iphone拍摄图片旋转方向
    function exit(file) {
        return new Promise(function (resolve, reject) {
            // 按顺时针旋转
            EXIF.getData(file, function () {
                // 手机旋转角度      返回值     图片旋转的角度
                // iphone 垂直拍摄照片 6 图片默认旋转270deg(即向左旋转90deg)    
                // iphone 90deg拍摄照片 3 图片默认旋转180deg(倒置)    
                // iphone 180deg拍摄照片 8 图片默认旋转90deg(即向右旋转90deg)    
                // iphone 270deg拍摄照片 1 图片正常    
                // 获取旋转角度 Orientation
                var Orientation = EXIF.getTag(this, 'Orientation');
                // FileReader 对象 获取file对象的base64资源
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    if (e.target.result) {
                        if (Orientation) {
                            // 创建 Image 对象
                            var img = new Image();
                            img.src = e.target.result;
                            img.onload = function () {
                                // 获取图片 宽、高
                                var width = img.width;
                                var height = img.height;
                                // 创建 canvas 对象 宽高和图像宽高相同
                                var canvas = document.createElement("canvas");
                                var ctx = canvas.getContext("2d");
                                // drawImage(图片对象,x坐标起始点,y坐标起始点)
                                switch (Number(Orientation)) {
                                    case 1:
                                        // canvas 宽高 和 图片宽高相同
                                        canvas.width = width;
                                        canvas.height = height;
                                        ctx.drawImage(img, 0, 0);
                                        break;
                                    case 3:
                                        canvas.width = width;
                                        canvas.height = height;
                                        ctx.rotate(3 * Math.PI);
                                        ctx.drawImage(img, -width, -height);
                                        break;
                                    case 6:
                                        canvas.width = height;
                                        canvas.height = width;
                                        ctx.rotate(-1.5 * Math.PI);
                                        ctx.drawImage(img, 0, -height);
                                        break;
                                    case 8:
                                        canvas.width = height;
                                        canvas.height = width;
                                        ctx.rotate(1.5 * Math.PI);
                                        ctx.drawImage(img, -width, 0);
                                        break;
                                }
                                var newBase64 = canvas.toDataURL("image/jpeg", 0.92);
                                resolve(dataURLtoFile(newBase64, file.name))
                            }
                        } else {
                            resolve(dataURLtoFile(e.target.result, file.name))
                        }
                    }
                }
            });
        })
    }
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
    // 获取订单详情-start
    var imgUrlArr = [];// 所有图片url数组
    var orderId = myLocal.getItem("orderId");
    var patientInfo = null;// 患者信息
    var doctorDetails = null;// 医生信息
    var orderInfo = null;// 订单信息
    $.ajax({
        headers: {
            token: myLocal.getItem("token"),
        },
        type: 'POST',
        url: IP + '/api-order/order/inquiry/getOrder',
        data: {
            "orderId": orderId,
        },
        async: false,
        dataType: 'json',
        success: function (data) {
            console.log(data)
            if (data.code == '20000') {
                orderInfo = data.result;
                $(".orderDescription").html(data.result.orderDescription);// 问题描述
                var doctorId = data.result.doctor;
                // 获取医生信息
                $.ajax({
                    headers: {
                        Accept: "application/json; charset=utf-8",
                        token: myLocal.getItem("token"),
                    },
                    type: 'GET',
                    url: IP + '/api-user/doctor/detail/getDoctorDetailById?doctorId=' + doctorId,
                    xhrFields: {
                        withCredentials: true,
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        if (data.code == 20000) {
                            doctorDetails = data.result;
                            $(".doctorName").html(data.result.doctorName);// 医生名
                            $(".titleName").html(data.result.titleName);// 职称
                            $(".hospitalName").html(data.result.hospitalName);// 医院名
                            $(".goodAtValue").html(data.result.doctorStrong);// 擅长
                            $(".hearImg").attr("src", data.result.headImg);// 头像
                        } else {
                            layer.msg("信息加载失败");
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                })
                // 获取患者信息
                var patientId = data.result.patient;
                getBaseInfoById(patientId);
                // 获取图片信息
                var patientArchive = data.result.patientArchive;
                $.ajax({
                    headers: {
                        Accept: "application/json; charset=utf-8",
                        token: myLocal.getItem("token"),
                    },
                    type: 'GET',
                    url: IP + '/api-archive/medical/report/getByGroupNumber?groupNumber=' + patientArchive,
                    xhrFields: {
                        withCredentials: true,
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        if (data.code == 20000) {
                            imgUrlArr = data.result;
                            var _html = '';
                            for (var i = 0; i < imgUrlArr.length; i++) {
                                _html += '<li class="imgItem" url="' + imgUrlArr[i] + '">\
                                <img class="photo" src="'+ imgUrlArr[i] + '" alt="">\
                                <img class="deleteImg" src="../images/delete.png" alt="">\
                            </li>'
                            }
                            $(".imgList").html(_html);
                        } else {
                            layer.msg("信息加载失败");
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                })
            } else {
                layer.msg("信息加载失败");
            }
        },
        error: function (err) {
            console.log(err)
        },
    });
    // 获取订单详情-end
    // 获取患者信息
    function getBaseInfoById(patientId) {
        $.ajax({
            headers: {
                Accept: "application/json; charset=utf-8",
                token: myLocal.getItem("token"),
            },
            type: 'GET',
            url: IP + '/api-record/patient/getBaseInfoById?patientId=' + patientId,
            xhrFields: {
                withCredentials: true,
            },
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.code == 20000) {
                    patientInfo = data.result;
                    myLocal.setItem("patientInfo", data.result);
                    $(".selectBtnText").html(data.result.patientName);// 患者名
                } else {
                    layer.msg("信息加载失败");
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
    }
    myLocal.getItem("patientInfo") && getBaseInfoById(myLocal.getItem("patientInfo").id);

    if (myLocal.getItem("draftOrder")) {
        var draftOrder = myLocal.getItem("draftOrder");
        myLocal.deleteItem("draftOrder");
        $(".orderDescription").val(draftOrder.orderDescription);
        imgUrlArr = draftOrder.imgUrlArr;
        var _tempHtml = '';
        for (var i = 0; i < imgUrlArr.length; i++) {
            _tempHtml += '<li class="imgItem" url="' + imgUrlArr[i] + '">\
                <img class="photo" src="'+ imgUrlArr[i] + '" alt="">\
                <img class="deleteImg" src="../images/delete.png" alt="">\
            </li>'
        };
        $(".imgList").html(_tempHtml);
    }

    // 选择患者
    $(".selectBtn").click(function () {
        // 保存填写的其他内容
        var urls = [];
        for (var i = 0; i < $(".imgList .imgItem").length; i++) {
            urls.push($(".imgList .imgItem").eq(i).attr("url"))
        }
        myLocal.setItem("draftOrder", {
            orderDescription: $(".orderDescription").val(),
            imgUrlArr: urls,
        })
        window.location = '/chestnut/selectPatients/SelectPatients.html';
    })

    // 查看大图
    $(".imgList").delegate(".imgItem", "click", function () {
        var urls = [];
        for (var i = 0; i < $(".imgList .imgItem").length; i++) {
            urls.push($(".imgList .imgItem").eq(i).attr("url"))
        }
        wx.previewImage({
            current: $(this).attr('url'), // 当前显示图片的http链接
            urls: urls, // 需要预览的图片http链接列表
        });
    })
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        $(".fileInput").attr("multiple", "multiple");
    }
    // 文件 处理 - start
    $(".fileInput").change(function () {
        layer.open({
            title: '',
            type: 1,
            content: $('.loadingContainer'),
            closeBtn: false,
            shadeClose: false,
            skin: 'noBackground',
        });
        var files = $(this)[0].files;// 选择的图片资源 
        if (files.length <= 0) {
            layer.closeAll();
            $('.loadingContainer').hide();
            return;
        }
        for (var i = 0; i < files.length; i++) {
            exit(files[i]).then(function (file) {
                reduceFile(file).then(function (newFile) {
                    var postData = new FormData();
                    postData.append("recordType", "patient-record");
                    postData.append("files", newFile);
                    $.ajax({
                        headers: {
                            token: myLocal.getItem("token"),
                        },
                        type: 'POST',
                        url: IP + '/api-third/cos/uploads',
                        xhrFields: {
                            withCredentials: true,
                        },
                        crossDomain: true,
                        processData: false,
                        contentType: false,
                        data: postData,
                        dataType: 'json',
                        success: function (data) {
                            console.log(data)
                            layer.closeAll();
                            $(".loadingContainer").hide();
                            if (data.code == 20000) {
                                var tempArr = data.result;
                                imgUrlArr = imgUrlArr.concat(tempArr);
                                var _html = '';
                                for (var i = 0; i < tempArr.length; i++) {
                                    _html += '<li class="imgItem" url="' + tempArr[i] + '">\
                                <img class="photo" src="'+ tempArr[i] + '" alt="">\
                                <img class="deleteImg" src="../images/delete.png" alt="">\
                            </li>'
                                };
                                $(".imgList").append(_html)
                            } else {

                            }
                        },
                        error: function (err) {
                            console.log(err);
                        },
                    })
                })
            })
        }
    })

    // 删除图片
    $(".imgList").delegate(".deleteImg", "click", function () {
        var _thisObj = $(this);
        try {
            $.ajax({
                headers: {
                    token: myLocal.getItem("token"),
                },
                type: 'POST',
                url: IP + '/api-archive/medical/report/deleteInquiryReport',
                xhrFields: {
                    withCredentials: true,
                },
                crossDomain: true,
                data: {
                    "imgPath": $(this).parents(".imgItem").attr("url"),
                },
                dataType: 'json',
                success: function (data) {
                    console.log(data)
                    if (data.code == 20000) {
                        _thisObj.parents('.imgItem').remove();
                    } else {
                        _thisObj.parents('.imgItem').remove();
                    }
                },
                error: function (err) {
                    console.log(err);
                },
            })
        } catch (error) {
            console.log(error)
        }
        return false;
    })


    // 订单修改事件 - start
    $(".submitBtn").click(function () {
        var tempImgUrls = [];
        for (var i = 0; i < $(".imgList .imgItem").length; i++) {
            tempImgUrls.push($(".imgList .imgItem").eq(i).attr("url"));
        }
        if (!$(".orderDescription").val()) {
            layer.msg("请输入问题描述")
        } else if ($(".orderDescription").val() >= 1000) {
            layer.msg("问题描述过长")
        } else if (tempImgUrls.length <= 0) {
            layer.msg("请上传图片")
        } else {
            layer.open({
                title: '',
                type: 1,
                content: $('.loadingContainer'),
                closeBtn: false,
                shadeClose: false,
                skin: 'noBackground',
            });
            myLocal.deleteItem("draftOrder");
            $.ajax({
                headers: {
                    token: myLocal.getItem("token"),
                },
                type: 'POST',
                url: IP + '/api-archive/medical/report/updateInquiryReport',
                xhrFields: {
                    withCredentials: true,
                },
                crossDomain: true,
                data: {
                    "patientId": patientInfo.id,
                    "imgUrlArr": tempImgUrls.join(','),
                    "reportGroup": orderInfo.patientArchive,
                },
                dataType: 'json',
                success: function (data) {
                    console.log(data)
                    if (data.code == 20000) {
                        var patientArchive = data.result;
                        $.ajax({
                            headers: {
                                token: myLocal.getItem("token"),
                            },
                            type: 'POST',
                            url: IP + '/api-order/order/inquiry/updateOrder',
                            xhrFields: {
                                withCredentials: true,
                            },
                            crossDomain: true,
                            data: {
                                "orderId": orderId,
                                "doctorId": doctorDetails.id,
                                "patientId": patientInfo.id,
                                "goodsId": orderInfo.goods,
                                "orderPrice": orderInfo.orderPrice,
                                "orderDescription": $(".orderDescription").val(),
                                "patientArchive": patientArchive,
                            },
                            dataType: 'json',
                            success: function (data) {
                                console.log(data)
                                layer.closeAll();
                                $('.loadingContainer').hide();
                                if (data.code == 20000) {
                                    window.location = '/chestnut/weChatPay/WeChatPay.html?' + data.result;
                                } else {
                                    layer.msg('发送失败');
                                }
                            },
                            error: function (err) {
                                console.log(err);
                            },
                        })
                    } else {
                        layer.msg('发送失败');
                    }
                },
                error: function (err) {
                    console.log(err);
                },
            })

        }
    })
    // 订单修改事件 - end
})