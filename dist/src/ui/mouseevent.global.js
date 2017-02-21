'use strict';

/**
 * Created by hyunwoo on 2017-02-17.
 */

var __ContextMenu = void 0;
$(function () {
    __ContextMenu = new function () {
        var contextKey = '_contextItem';
        var that = this;
        this.addContextItem = function ($item, name, action, disable) {
            if (_.isNil($item[contextKey])) $item[contextKey] = [];
            $item[contextKey].push({
                name: name,
                action: action,
                disable: disable
            });
        };

        this.getContextItem = function ($item) {
            return $item[contextKey];
        };

        this.wrapper = $('.contextmenu-wrapper');
        this.menu = this.wrapper.find('.contextmenu');
        this.menu.click(function (evt) {
            evt.stopPropagation();
        });

        this.open = function (evt) {
            console.log(evt);

            var target = $(evt.target);
            console.log(target);
            console.log(this.getContextItem(target));

            that.clear();
            // that.wrapper.addClass('open');
            // that.menu.css('left', evt.clientX);
            // that.menu.css('top', evt.clientY);

            // $('<div class="header">menu</div>').appendTo(that.menu);
            // _.forEach(items, function (item) {
            //     var $item = $('<div class="item">' + item + '</div>').appendTo(that.menu);
            //     $item.click(function () {
            //
            //     });
            // })
        };

        this.clear = function () {
            that.menu.empty();
        };

        this.close = function () {
            that.clear();
            that.wrapper.removeClass('open');
        };

        this.wrapper.click(this.close);
    }();
});

$(document).bind("mousedown", function (evt) {
    evt = evt.originalEvent;
    if (evt.which == 3) {
        var $target = $(evt.target);
        if ($target.attr('evt-type') === 'menu') {
            console.log('Open Menu');
        }
        __ContextMenu.open(evt);
    }
});
//# sourceMappingURL=mouseevent.global.js.map