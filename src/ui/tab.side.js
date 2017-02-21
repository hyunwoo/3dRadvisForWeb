/**
 * Created by hyunwoo on 2017-02-20.
 */

const __UI = {
    SideTab: [],
    _data: {},
    injectData: function (data) {
        this._data = data;
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
            console.log(id);
            __UI[id]();
        }

        // Create Bottom Group

    },
    createAxisUsage: function () {
        __UI.$settingTab.$contents.empty();
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
    createAxisGeometry: function (axisName) {
        __UI.$settingTab.$contents.empty();
        if (_.isNil(axisName)) axisName = __data.numericKeys[0];
        var currentAxis = __UI._data.findAxis(axisName);
        var $contents = __UI['$settingTab']['$contents'];

        // Add Dropdown
        createComponentDropDown($contents, {
            name: 'Axis Selector',
            desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            listItem: _.map(__UI._data.axis, function (d) {
                return d.name;
            }),
            selected: axisName,
        }, __UI.createAxisGeometry);

        var $graphic = $('<div class="graphic"></div>').appendTo($contents);
        var $desc = $('<div class="desc"></div>').appendTo($graphic);
        var $head = $('<div class="head"></div>').appendTo($desc);
        var $body = $('<div class="body"></div>').appendTo($desc);


        _.forEach(Setting.Radvis.Axis.Geometry, function (v, k) {
            v.value = currentAxis[k];
            createComponentSlider($contents, v, function (val) {
                currentAxis[k] = val;
                __RadvisController.adjustAxis();
                v.value = val;
            });
        });

        $head.html(axisName);
        $body.html(currentAxis.stats.toString())
    },

    createNodeGeometry: function () {
        __UI.$settingTab.$contents.empty();
        var $contents = __UI['$settingTab']['$contents'];

        _.forEach(Setting.Radvis.Node.Geometry, function (v) {
            createComponentSlider($contents, v, function (val) {
                //__RadvisController.adjustAxis();
                v.value = val;
                console.log(Setting.Radvis.Node.Geometry);
                __RadvisController.updateNodes();
            });
        });

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
            Geometry: 'createNodeGeometry',
        }
    });
})();
