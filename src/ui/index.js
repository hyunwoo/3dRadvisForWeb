/**
 * Created by suhyun on 2017. 2. 23..
 */

var __IndexDataList = new function () {
    this.createDataList = function (data) {
        var $list = $('.dataList .list');

        _.map(data, function (d) {
            var item = $('<div class="item"> ' +
                '<div class="parentItem">' + d.parent + '</div>' +
                '<div class="showChildList i material-icons">more_vert</div>' +
                '</div>').appendTo($list);

        });

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


    this.showChildList = function(){
        var $childList = $(this).siblings('.childList');
        var $childItem = $childList.find('.childItem');
        if(!$childList.hasClass('show')) $childList.addClass('show');
        else $childList.removeClass('show')
    };

    $('.showChildList').click(this.showChildList);


};
