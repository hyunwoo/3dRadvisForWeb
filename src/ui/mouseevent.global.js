/**
 * Created by hyunwoo on 2017-02-17.
 */


let __ContextMenuWrapper;
let __ContextWindows;
$(function () {
    __ContextMenuWrapper = new ContextMenuWrapper();
    __ContextWindows = {
        AxisSetting: new AxisSettingWindow(),
    }
});

function AxisSettingWindow() {
    this.open = function (target) {

    }
}

function ContextMenuWrapper() {
    this.wrapper = $('.contextmenu-wrapper');
    this.menu = this.wrapper.find('.contextmenu');
    this.menu.click(function (evt) {
        evt.stopPropagation();
    });
    var that = this;

    this.open = function (x, y, target, items, header) {
        that.clear();
        that.wrapper.addClass('open');
        that.menu.css('left', x);
        that.menu.css('top', y);
        if (header === undefined) header = 'menu';

        $('<div class="header">' + header + '</div>').appendTo(that.menu);

        _.forEach(items, function (item) {
            var $item = $('<div class="item">' + item + '</div>').appendTo(that.menu);
            $item.click(function () {

            });
        })

    };

    this.clear = function () {
        that.menu.empty();
    };

    this.close = function () {
        that.clear();
        that.wrapper.removeClass('open');
    };

    this.wrapper.click(this.close);

}


$(function () {
    var inputs = $('input[type="range"]');
    _.forEach(inputs, function (i) {

    });
});
$(document).bind("mousedown", function (evt) {
    evt = evt.originalEvent;
    return;
    if (evt.which == 3) {
        var $target = $(evt.target);
        console.log($target);
        if ($target.attr('evt-type') === 'menu') {
            console.log('Open Menu');
        }

        console.log(evt);
        __ContextMenuWrapper.open(evt.clientX, evt.clientY, 'hoho', [0, 1, 2]);
    }

});