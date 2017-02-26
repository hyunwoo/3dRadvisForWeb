/**
 * Created by suhyun on 2017. 2. 23..
 */

var GridSystem = new function () {
    let that = this;


    var _page;
    this.createPage = function () {
        _page = $('<div class="page"></div>').appendTo('body');
        return that;
    };

    this.clearPage = function () {
        $('.page').remove();
        _page = null;
        return that;
    };

    /**
     * [{
     *  cell : numeric
     *  _id : id
     * }]
     */
    function isPageNil() {
        var nil = _.isNil(_page);
        if (nil) __UIStatic.Toast.open('Grid System : _page is nil');
        return _.isNil(_page);
    }

    this.createGrid = function (grids) {
        if (isPageNil()) return;
        if (!_.isArray(grids)) grids = [grids];
        var grid = $('<div class="grid"></div>').appendTo(_page);
        console.log(grids);
        _.forEach(grids, function (d) {
            var cell = $(`<div class="cell grid-${d.cell}"></div>`).appendTo(grid);
            cell.attr('id', d._id);
        });
        console.log(grid, _page);
        return that;
    };

    /**
     * @param $target : jquery
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
        const $header = $('<div class="header"></div>').appendTo($target);
        $(`<div class="text">${d.text}</div>`).appendTo($header);

        _.forEach(d.actions, function (action) {
            const $item = $(`<div class="action i material-icons">${action.icon}</div>`).appendTo($header);
            $item.click(action.action);
        });
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
    this.addGridContentItem = function ($target, contents) {
        if (_.isString($target)) $target = $($target);
        if (!_.isArray(contents)) contents = [contents];

        console.log($target.find('.contents'));
        const $contents = $target.find('.contents').length == 0 ?
            $('<div class="contents"></div>').appendTo($target) : $target.find('.contents');

        _.forEach(contents, function (content) {
            var $item = $(`<div class="item">${content.text}</div>`).appendTo($contents);
            $item.attr('id', content._id);
            $item.click(content.action);
        });
        return that;
    };

    this.setGridContent = function ($target, content) {
        if (_.isString($target)) $target = $($target);

        console.log($target.find('.contents'));
        const $contents = $target.find('.contents').length == 0 ?
            $('<div class="contents"></div>').appendTo($target) : $target.find('.contents');

        $contents.html(content);
        return that;
    };

    this.removeGridContent = function ($target, _id) {

    };

};
