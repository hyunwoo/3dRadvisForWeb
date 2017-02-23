/**
 * Created by hyunwoo on 2017-02-17.
 */


let __ContextMenu;
$(function () {
    __ContextMenu = new function () {
        const contextKey = '_contextItem';
        var that = this;
        this.addContextItem = function ($item, name, action, disable) {
            if (_.isNil($item[contextKey])) $item[contextKey] = [];
            $item[contextKey].push({
                type: 'action',
                name: name,
                action: action,
                disable: !_.isNil(disable) || _.isNil(action),
            });
            return that;
        };

        this.addContextSeparater = function ($item, name) {
            $item[contextKey].push({
                type: 'separater',
                name: name,
            });
            return that;
        };

        this.addContextSpacer = function ($item) {
            $item[contextKey].push({
                type: 'spacer',
            });
            return that;
        };

        this.getContextItem = function ($item) {
            if (_.isNil($item[contextKey])) return [];
            return $item[contextKey];
        };

        this.wrapper = $('.contextmenu-wrapper');
        this.menu = this.wrapper.find('.contextmenu');
        this.menu.click(function (evt) {
            evt.stopPropagation();
        });


        this.open = function (evt, $item) {
            evt = evt.originalEvent;
            console.log(evt);
            that.clear();
            that.wrapper.addClass('open');
            that.menu.css('left', evt.clientX);
            that.menu.css('top', evt.clientY);


            // $('<div class="header">Setting' +
            //     '<div class="icon i material-icons">settings</div>' +
            //     '</div>').appendTo(that.menu);
            _.forEach(__ContextMenu.getContextItem($item), function (item) {
                if (_.isNil(item.type) || item.type == 'action') {
                    var $item = $('<div class="item">' + item.name + '</div>').appendTo(that.menu);
                    if (!item.disable)
                        $item.click(function () {
                            item.action();
                            __ContextMenu.close();
                        });
                    else $item.addClass('disable');
                }
                else if (item.type == 'separater') $('<div class="separater">' + item.name + '</div>').appendTo(that.menu);
                else if (item.type == 'spacer') $('<div class="spacer"></div>').appendTo(that.menu);
            });
        };

        this.adjust = function ($item) {
            $item.on('mousedown', function (evt) {
                if (evt.which == 3)
                    __ContextMenu.open(evt, $item);
            });
        };

        this.clear = function () {
            that.menu.empty();
        };

        this.close = function () {
            that.clear();
            that.wrapper.removeClass('open');
        };

        this.wrapper.click(this.close);
    };
});

