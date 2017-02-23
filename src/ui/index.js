/**
 * Created by suhyun on 2017. 2. 23..
 */

function dataList(data){
    var $list = $('.dataList .list');

    var item = $('<div class="item"></div>');

    _.map(data, function(d){
        var target = item.clone().appendTo($list);
        $(target).html(d)
    });

    var target = $('.dataList .list .item');

    target.click(function(){
        var $this = $(this);
        if(!$this.hasClass('click')){
            target.removeClass('click');
            $this.addClass('click')
        }
    })
}

function controlDesc(){
    var input = $('.viewer')
}