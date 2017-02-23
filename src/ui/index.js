/**
 * Created by suhyun on 2017. 2. 23..
 */


var __IndexDataList = new function () {
    this.createDataList = function (data) {
        var $list = $('.dataList .list');
        var item = $('<div class="item"></div>');
        _.map(data, function (d) {
            var target = item.clone().appendTo($list);
            $(target).html(d)
        });
        var target = $('.dataList .list .item');
        target.click(function () {
            var $this = $(this);
            if (!$this.hasClass('click')) {
                target.removeClass('click');
                $this.addClass('click')
            }
        })
    };

    this.controlDesc = function () {
        var $viewInput = $('.viewer .input');
        var $icon = $('#descModifier');
        var $viewTextarea = $('.viewer textarea');
        $viewTextarea.on('change', function (ele) {
            console.log($viewTextarea.html())
        });
        if (!$viewTextarea.hasClass('visible')) {
            $viewInput.removeClass('visible');
            $viewTextarea.addClass('visible');
            $viewTextarea.val($viewInput.html());
            $icon.html('done');
        } else {
            $viewInput.addClass('visible');
            $viewTextarea.removeClass('visible');
            $viewInput.html($viewTextarea.val());
            $icon.html('mode_edit');
        }
    };

    var controller = $('#descModifier');
    $(controller).click(this.controlDesc);

    $('#DataListUploadFile').click(function () {
        $('#DataListUploadFileInput').trigger('click');
    });
    __FileReader.InputReadFile($('#DataListUploadFileInput'), __Firebase.uploadData);

};
