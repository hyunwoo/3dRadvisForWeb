/**
 * Created by hyunwoo on 2017-02-20.
 */
function createSlide(parent, min, max, onChange) {
    var component = $('<div class="component"></div>');
    var $range = $('<div class="slider"></div>').appendTo(component);
    var core = $('<div class="point"></div>').appendTo($range);
    var num = $('<div class="num">30' +
        '<div class="pin"></div>' +
        '</div>').appendTo(core);
    var bar = $('<div class="bar"></div>').appendTo($range);
    var currentValue = 0;

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
        if (down)
            onChange(currentValue);
        down = false;

    });
    function updatePin(e) {
        var x = e.originalEvent.clientX - $range.offset().left;
        if (x < 0) x = 0;
        else if (x > $range.width()) x = $range.width();
        var width = $range.width();
        currentValue = x / width * (max - min) + min;

        num.contents().filter(function () {
            return this.nodeType == 3;
        })[0].nodeValue = __Formatter.number(Math.floor(currentValue));

        //num.text(currentValue);
        core.css('left', x);
        bar.css('width', x);
    }

}

// Run!


