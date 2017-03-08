'use strict';

/**
 * Created by suhyun on 2017. 2. 21..
 */

function createComponentDropDown(parent, option, onChange) {
    console.log('comp dropDown', option);
    var component = $('<div class="component"></div>');
    __ComponentUtil.createName(component, option);
    var $dropDown = $('<div class="dropDown">' + '<div class="selected">' + option.selected + '</div>' + '<div class="arrow i material-icons">arrow_drop_down</div>' + '<div class="dropDownList"></div>' + '</div>').appendTo(component);

    var $dropDownList = $dropDown.find('.dropDownList');

    _.forEach(option.listItem, function (d) {

        if (d.startsWith('^#')) {
            $('<div class="listItem separater">' + d.replace('^#', '') + '</div>').appendTo($dropDownList);
        } else {
            var item = $('<div class="listItem">' + d + '</div>');
            item.appendTo($dropDownList);
            item.click(clickList);
        }
    });

    __ComponentUtil.createDesc(component, option);

    component.appendTo($(parent));

    $('.dropDown').click(openDropDown);

    function openDropDown() {
        var target = $(this);
        if (!target.hasClass('click')) {
            target.addClass('click');
            $dropDownList.css('height', option.listItem.length * 42);
        } else {
            target.removeClass('click');
            $dropDownList.css('height', 0);
        }
    }

    function clickList() {
        var clickTarget = $(this).html();
        $dropDown.find('.selected').html(clickTarget);
        onChange(clickTarget);
    }
}
//# sourceMappingURL=component.dropdown.js.map