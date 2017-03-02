'use strict';

/**
 * Created by hyunwoo on 2017-02-26.
 */

var GridSystem = new function () {
    var that = this;
    var _page;
    this.createPage = function () {
        _page = $('<div class="page"></div>').appendTo('body');
        return that;
    };

    this.clearPage = function (callback) {
        injectAnimate('.page', 'disappear');
        setTimeout(function () {
            $('.page').remove();
            callback();
            _page = null;
        }, 300);
        return that;
    };

    /**
     * [{
     *  cell : numeric
     *  _id : id
     * }]
     */
    this.createGrid = function (grids) {
        if (isPageNil()) return;
        if (!_.isArray(grids)) grids = [grids];
        var grid = $('<div class="grid"></div>').appendTo(_page);
        _.forEach(grids, function (d) {
            var $cell = $('<div class="cell grid-' + d.cell + '"></div>').appendTo(grid);
            $cell.attr('id', d._id);
            $('<div class="contents"></div>').appendTo($cell);
        });
        return that;
    };

    /**
     * @param $target : string or jquery
     * @param d : Object
     *  text : string (header string)
     *  actions : [{
     *      icon :
     *      action :
     *  }]
     */
    this.setGridHeader = function ($target, d) {
        if (_.isString($target)) $target = $($target);
        $target.find('.header').remove();

        var $header = $('<div class="header"></div>').prependTo($target);
        $('<div class="text">' + d.text + '</div>').appendTo($header);
        var $actions = $('<div class="actions"></div>').appendTo($header);

        _.forEach(d.actions, function (action) {
            var $item = $('<div class="action i material-icons">' + action.icon + '</div>').appendTo($actions);
            $item.click(action.action);
            if (!_.isNil(action.addition)) $item.addClass(action.addition);
        });
        injectAnimate($header, 'appear');
        return that;
    };

    /**
     * @param $target : jquery
     * @param d : Object
     *  contents : [{
     *      _id : string (unique)
     *      text :
     *      action : click function
     *  }]
     */

    function injectAnimate($target, anim) {
        if (_.isString($target)) $target = $($target);
        $target.addClass(anim);
    }

    this.removeElement = function ($target) {
        if (_.isString($target)) $target = $($target);
        $target.remove();
    };

    this.updateGridContentItem = function ($target, content) {
        if (_.isString($target)) $target = $($target);
        console.log($target);
        var update = _.isNil(content.text) ? content.name : content.text;
        $target.html(update);
    };
    this.addGridContentItem = function ($target, contents) {
        if (_.isString($target)) $target = $($target);
        if (!_.isArray(contents)) contents = [contents];

        var $contents = $target.find('.contents');
        if ($contents.length == 0) {
            console.warn('not exist contents');
            return;
        }
        _.forEach(contents, function (content) {
            if ($('#' + content._id).length != 0) return;
            var $item = $('<div class="item">' + content.text + '</div>').appendTo($contents);
            $item.attr('id', content._id);
            $item.click(content.action);
            injectAnimate($item, 'appear');
        });
        return that;
    };

    this.addGridContentDesc = function ($target, descs) {
        if (_.isString($target)) $target = $($target);
        if (!_.isArray(descs)) descs = [descs];

        var $contents = $target.find('.contents');
        if ($contents.length == 0) {
            console.warn('not exist contents');
            return;
        }
        _.forEach(descs, function (content) {
            var $item = $('<div class="desc">' + content.text + '</div>').appendTo($contents);
            $item.attr('id', content._id);
            $item.click(content.action);
            injectAnimate($item, 'appear');
        });
        return that;
    };

    this.clearGridAddition = function ($target) {
        if (_.isString($target)) $target = $($target);
        $target.find('.contents .addition-info').remove();
        return that;
    };

    this.setGridContentAddition = function ($target, addition) {
        if (_.isString($target)) $target = $($target);
        if (!_.isArray(addition)) addition = [addition];

        $target = $target.find('.contents');
        $target = $('<div class="addition-info"></div>').appendTo($target);
        _.forEach(addition, function (d) {
            var $item = $('<div class="' + d.class + '">' + d.text + '</div>').appendTo($target);
            $item.find('action').click(d.action);
        });
        return that;
    };

    this.setGridContent = function ($target, content) {
        if (_.isString($target)) $target = $($target);

        var $contents = $target.find('.contents').length == 0 ? $('<div class="contents"></div>').appendTo($target) : $target.find('.contents');

        $contents.html(content);
        return that;
    };

    function isPageNil() {
        var nil = _.isNil(_page);
        if (nil) __UIStatic.Toast.open('Grid System : _page is nil');
        return _.isNil(_page);
    }
}();
//# sourceMappingURL=global.grid.js.map