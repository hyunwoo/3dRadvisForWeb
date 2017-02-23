'use strict';

/**
 * Created by hyunwoo on 2017-02-20.
 */
function ComponentSlider(parent, option, onChange) {
    var that = this;
    this.option = option;

    if (_.isNil(option.min) || _.isNil(option.max)) {
        console.error('Slider Min or Max not defined');
        return false;
    }
    var component = $('<div class="component"></div>');
    __ComponentUtil.createName(component, option);
    var $range = $('<div class="slider"></div>').appendTo(component);
    __ComponentUtil.createDesc(component, option);

    var core = $('<div class="point"></div>').appendTo($range);
    var num = $('<div class="num">30' + '<div class="pin"></div>' + '</div>').appendTo(core);

    var bar = $('<div class="bar"></div>').appendTo($range);
    var currentValue = 0;
    __ComponentUtil.createOptions($range, ['min', 'max'], option);

    component.appendTo($(parent));

    var down = false;
    $range.on('mousedown', function (e) {
        down = true;
        $(num).addClass('click');
        updatePin(e);
        return false;
    });

    $(document).on('mousemove', function (e) {
        if (down) updatePin(e);
    });

    $(document).on('mouseup', function () {
        $(num).removeClass('click');
        if (down) {
            onChange(Math.floor(currentValue));
        }
        down = false;
    });

    function updatePin(e) {
        var x = e.originalEvent.clientX - $range.offset().left;
        if (x < 0) x = 0;else if (x > $range.width()) x = $range.width();
        var width = $range.width();
        currentValue = x / width * (option.max - option.min) + option.min;

        setDisplayObjects(x, currentValue);
    }

    function setDisplayObjects(x, currentValue) {
        num.contents().filter(function () {
            return this.nodeType == 3;
        })[0].nodeValue = __Formatter.number(Math.floor(currentValue));
        //num.text(currentValue);
        core.css('left', x);
        bar.css('width', x);
    }

    this.update = function (value) {
        setDisplayObjects((value - option.min) / (option.max - option.min) * $range.width(), value);
    };

    if (!_.isNil(option.value)) this.update(option.value);
    return this;
}

// Run!
//# sourceMappingURL=component.slider.js.map