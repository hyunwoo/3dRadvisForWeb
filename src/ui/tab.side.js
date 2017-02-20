/**
 * Created by hyunwoo on 2017-02-20.
 */

const __UI = {
    SideTab: [],
    __data: {},
    injectData: function (data) {
        this.__data = data;
    },
    createSideTab: function () {
        var $sideTab = __UI['$sideTab'] = $('.sideTab');
        __UI['$settingTab'] = $('.settingTab');
        __UI['$settingTab']['$header'] = $('.settingTab .header-group');
        __UI['$settingTab']['$contents'] = $('.settingTab .contents');
        __UI['$settingTab']['$bottom'] = $('.settingTab .bottom');

        _.forEach(__UI.SideTab, function (v) {
            if (!_.isNil(v.Type) && v.Type == 'Button') {
                const $item = $('<div class="tabItemWrapper">' +
                    '<div class="selectBorder"></div>' +
                    '<div class="tabItem i material-icons">' + v.Icon + '</div>' +
                    '<div class="tabItemName">' + v.Name + '</div>' +
                    '</div>').appendTo($sideTab);
                $item['_data'] = v;
                $item.click(function () {
                    if ($item.hasClass('click')) {
                        $('.tabItemWrapper').removeClass('click');
                        __UI.$settingTab.removeClass('open');
                    } else {
                        $('.tabItemWrapper').removeClass('click');
                        $item.addClass('click');
                        __UI.$settingTab.addClass('open');
                        __UI.createSettingTab($item);
                    }
                });

            } else {
                const $item = $('<div class="' + v.Type + '"></div>');
                if (!_.isNil(v.Text)) $('<div class="text">' + v.Text + '</div>').appendTo($item);
                $item.appendTo($sideTab);
            }
        });
        __UI['$settingTab']['$header'].find('.closer').click(function () {
            $('.tabItemWrapper').removeClass('click');
            __UI.$settingTab.removeClass('open');
        });

        $sideTab.find('.tabOpener').click(function () {
            if (!$sideTab.hasClass('open')) $sideTab.addClass('open');
            else $sideTab.removeClass('open');
        });


    },
    createSettingTab: function (ele) {
        const data = ele._data;

        // Create Header Group
        __UI.$settingTab.$header.find('.title').html(data.Name);
        const $innerTab = __UI.$settingTab.$header.find('.innerTab');
        $innerTab.empty();

        const $headerItems = [];
        _.forEach(data.Tabs, function (viewId, k) {
            const $item = $('<div class="item">' + k +
                '<div class="border">' +
                '</div>').appendTo($innerTab);
            $headerItems.push($item);
            $item.click(function () {
                _.forEach($headerItems, function (v) {
                    v.removeClass('active');
                });
                $item.addClass('active');
                createContentView(viewId);
            })
        });
        $headerItems[0].trigger('click');

        // Create Contents
        function createContentView(id) {
            __UI.$settingTab.$contents.empty();
            console.log(id);
            __UI[id]();
        }

        // Create Bottom Group

    },
    createAxisUsage: function () {
        let $tabAxis = __UI['$settingTab']['$contents'];
        let parent = $('<div class="list axis"></div>').appendTo($tabAxis);

        _.forEach(__data.axis, function (d, i) {
            var $item = $('<div class="item">' +
                '<div class="visible i material-icons">check_box</div>' +
                '<div class="invisible i material-icons">check_box_outline_blank</div>' +
                // '<div class="spacing">1.0</div>' +
                '<div class="text">' + d.name + '</div>' +
                '</div>');

            $item.appendTo(parent);

            if (d.active) $item.addClass('click');


            /*$item.on('contextmenu', function (evt) {
             parent.find('.item').removeClass('active');
             parent.find('.setting').remove();
             $item.addClass('active');
             $('<div class="setting i material-icons">settings</div>').appendTo($item);
             });*/

            $item.on('click', function (evt) {
                d.active = !$item.hasClass('click');
                if (!d.active) $item.removeClass('click');
                else $item.addClass('click');
                __RadvisController.adjustAxis();
            });

        });
    },
    createAxisGeometry: function () {

        let graphicAxis = {};

        // $sliders: this.$field.find('input[type="range"]'),
        //     $slider_clear: this.$field.find('#axis-controller-clear'),
        //     desc: {
        //     $head: this.$field.find('.desc .head'),
        //         $body: this.$field.find('.desc .body'),
        // }

        graphicAxis.$field = $('.graphic').appendTo(__UI['$settingTab']['$contents']);
        $('<div class="controller">' +
            '<div class="name"></div>' +
            '<div class="component"></div>' +
            /**/'<input class="slider" data="setting" type="range" data-name="Radvis NodeSize"' +
            'update="__RadvisController.updateNodes()" min="5" max="100" step=0.1/>' +
            '<div class="desc"></div>' +
            '</div>'
        ).appendTo(__UI['$settingTab']['$contents']);

        // create to
        //graphicAxis.desc.$head.html(d.name);
        //graphicAxis.desc.$body.html(d.stats.toString());

        return;

        _.forEach(graphicAxis.$sliders, function (ranger) {
            var $ranger = $(ranger);
            console.log($ranger.attr('data-name'), d[$ranger.attr('data-name')]);
            var val = d[$ranger.attr('data-name')];
            $ranger.val(val == undefined ? 0 : val);
        });

        graphicAxis.$slider_clear.unbind();
        graphicAxis.$slider_clear.click(function () {
            console.log('clear')

            _.forEach(graphicAxis.$sliders, function (ranger) {

                var $ranger = $(ranger);
                var key = $ranger.attr('data-name');
                if (!_.isNil(Setting.Radvis.Axis.Controller[key]))
                    $ranger.val(Setting.Radvis.Axis.Controller[key]);
            });

            graphicAxis.$sliders.trigger('change');
            __RadvisController.adjustAxis();

        });

        graphicAxis.$sliders.unbind();
        graphicAxis.$sliders.on('change', function () {
            var $this = $(this);
            var key = $this.attr('data-name');
            var value = Number($this.val());
            if (!_.isNumber(value)) alert('?');
            console.log(key, value);
            d[key] = value;

            __RadvisController.adjustAxis();
        });
    },

    createNodeGeometry: function () {

    }
};


$(function () {

});


function clickSideTabItem() {


}


(function () {
    __UI.SideTab.push({
        Type: 'spacer',
    });
    __UI.SideTab.push({
        Type: 'Button', Name: 'Overview', Icon: 'home'
    });
    __UI.SideTab.push({
        Type: 'separater', Text: 'Global Setting'
    });
    __UI.SideTab.push({
        Type: 'Button',
        Name: 'Axis',
        Icon: 'view_week',
        Tabs: {
            Usage: "createAxisUsage",
            Geometry: 'createAxisGeometry',
        }
    });

    __UI.SideTab.push({
        Type: 'Button',
        Name: 'Node',
        Icon: 'toll',
        Tabs: {
            Usage: "createNodeGeometry",
            Geometry: 'createNodeGeometry',
        }
    });
})();
