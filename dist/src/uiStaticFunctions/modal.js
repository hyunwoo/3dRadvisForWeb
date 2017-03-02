'use strict';

/**
 * Created by hyunwoo on 2017-03-02.
 */

var __Modal = new function () {
    var that = this;
    var $dimension = $('#modalDimensionFieldMaker');

    var $dimensionTitle = $dimension.find('.title');
    var $dimensionContent = $dimension.find('.content');
    var $dimensionPos = $dimension.find('.pos');
    var $dimensionNeg = $dimension.find('.neg');
    var $dimensionAxisSelector = $dimension.find('#axisListSelector');

    this.dimension = new function () {
        this.open = function (opt) {
            $dimension.addClass('open');
            $dimensionTitle.html(opt.title);

            $dimensionPos.unbind();
            $dimensionPos.click(function () {
                that.dimension.close();
                opt.pos.action();
            });
        };
        $dimension.find('.closer').click(function () {
            console.log('?');
            that.dimension.close();
        });
        this.close = function () {
            $dimension.removeClass('open');
        };

        this.clearAxisList = function () {
            $dimension.find('#axisListSelector').empty();
        };

        this.addAxisList = function (value) {
            var item = $('<div class="item">\n                <div class="checkbox i material-icons">check_box</div>\n                <div class="axis">' + value.name + '</div>\n                <div class="value"></div>\n                <div class="value">' + __Formatter.number(value.mean) + '</div>\n                <div class="value">' + __Formatter.number(value.min) + '</div>\n                <div class="value">' + __Formatter.number(value.max) + '</div>\n                <div class="value">' + __Formatter.number(value.median) + '</div>\n                <div class="value">' + __Formatter.number(value.sigma) + '</div>\n            </div>').appendTo($dimensionAxisSelector);
            item.click(function () {
                var box = $(this).find('.checkbox');
                if (box.hasClass('unchecked')) {
                    box.removeClass('unchecked');
                    box.html('check_box');
                } else {
                    box.addClass('unchecked');
                    box.html('check_box_outline_blank');
                }
            });
        };
    }();
    $dimensionNeg.click(function () {
        that.Modal.close();
    });
}();

$(function () {});
//# sourceMappingURL=modal.js.map