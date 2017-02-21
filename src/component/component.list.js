/**
 * Created by suhyun on 2017. 2. 21..
 */


function adjustListMovable(list, onChange) {
    var $list = $(list);
    var items = $list.find('.item');
    items.on('mousedown', function (evt) {
        var currentWidth = $list.width();
        var $this = $(this);
        $this.css('position', 'fixed')
            .css('width', currentWidth)
            .css('z-index', 100);


        var moveEvt = function (evt) {
            $this.css('left', evt.clientX)
                .css('top', evt.clientY)
        };

        $(document).on('mousemove', moveEvt);

        var upevt = $(document).on('mouseup', function (evt) {
            //TODO
            $(document).unbind('mousemove', moveEvt);
            console.log(evt.clientY);
            console.log($list.offset())



            // $this.css('left', evt.clientX)
            //     .css('top', evt.clientY)
        });
    })


}


