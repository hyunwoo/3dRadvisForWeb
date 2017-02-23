/**
 * Created by hyunwoo on 2017-02-20.
 */

const __UI = {
    SideTab: [],
    injectData: function (data) {
        // this._data = data;
    },
    createSideTab: function () {
        let $sideTab = __UI['$sideTab'] = $('.sideTab');
        __UI['$settingTab'] = $('.settingTab');
        __UI['$settingTab']['$header'] = $('.settingTab .header-group');
        __UI['$settingTab']['$contents'] = $('.settingTab .contents');
        __UI['$settingTab']['$bottom'] = $('.settingTab .bottom');

        _.forEach(__UI.SideTab, function (v) {
            let $item;
            if (!_.isNil(v.Type) && v.Type == 'Button') {
                $item = $('<div class="tabItemWrapper">' +
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
                $item = $('<div class="' + v.Type + '"></div>');
                if (!_.isNil(v.Text)) $('<div class="text">' + v.Text + '</div>').appendTo($item);
                $item.appendTo($sideTab);
            }


            if (!_.isNil(v.AppendClass)) $item.addClass(v.AppendClass);

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


    $SettingTabHeaderItems: {},
    activeSettingTabHeader: function (header) {
        const that = this;
        if (_.isNil(this.$SettingTabHeaderItems[header])) {
            alert('not exist header');
            return;
        }
        _.forEach(that.$SettingTabHeaderItems, function (v) {
            v.removeClass('active');
        });
        this.$SettingTabHeaderItems[header].addClass('active');
    },
    createSettingTab: function (ele) {
        const data = ele._data;
        const that = this;
        // Create Header Group
        __UI.$settingTab.$header.find('.title').html(data.Name);
        const $innerTab = __UI.$settingTab.$header.find('.innerTab');
        $innerTab.empty();

        this.$SettingTabHeaderItems = {};
        _.forEach(data.Tabs, function (viewId, k) {
            const $item = $('<div class="item">' + k +
                '<div class="border">' +
                '</div>').appendTo($innerTab);
            that.$SettingTabHeaderItems[k] = $item;
            $item.click(function () {
                that.activeSettingTabHeader(k);
                createContentView(viewId);
            });
        });
        _.values(this.$SettingTabHeaderItems)[0].trigger('click');

        // Create Contents
        function createContentView(id) {
            console.log(id);
            __UI[id]();
        }

        // Create Bottom Group
    },

    createAxisUsage: function () {
        const that = this;
        __UI.$settingTab.$contents.empty();
        __UI.$settingTab.$bottom.empty();

        let option = Setting.Radvis.Axis.Visibility;
        console.log(option);

        let $contents = __UI['$settingTab']['$contents'];
        let $bottom = __UI['$settingTab']['$bottom'];

        let visibleButton = __UI.createContentBottomIcon('visibility', onVisibleButtonClick);
        let invisibleButton = __UI.createContentBottomIcon('visibility_off', onVisibleButtonClick);
        __UI.createContentBottomIcon('refresh', refresh, 'actor');
        if (!option.visible) visibleButton.addClass('disable');
        if (!option.invisible) invisibleButton.addClass('disable');


        let parent = $('<div class="list axis"></div>').appendTo($contents);

        parent.sortable({
            update: function () {
                _.forEach(parent.find('.item'), function (v, i) {
                    const key = $(v).find('.text').html();
                    // __RadvisController.axises[key].index = i;
                    // console.log(__RadvisController.axises[key]);
                    // console.log(key, i);
                    __RadvisController.axises[key].axis.index = i;
                });
                __RadvisController.adjustAxis();
            }
        });


        function onVisibleButtonClick() {
            let $this = $(this);
            console.log($this.hasClass('disable'));

            if ($this.hasClass('disable')) $this.removeClass('disable');
            else $this.addClass('disable');

            refresh();
        }

        function refresh() {
            option.visible = !visibleButton.hasClass('disable');
            option.invisible = !invisibleButton.hasClass('disable');
            __UI.createAxisUsage();
        }

        const sortedAxis = _.sortBy(__data.axis, function (axis) {
            return axis.index;
        });
        _.forEach(sortedAxis, function (d, i) {
            if (!((d.active && option.visible) || (!d.active && option.invisible))) return;
            let $item = $('<div class="item">' +
                '<div class="visible i material-icons">visibility</div>' +
                '<div class="invisible i material-icons">visibility_off</div>' +
                // '<div class="spacing">1.0</div>' +
                '<div class="text">' + d.name + '</div>' +
                '</div>');

            $item.appendTo(parent);

            if (d.active) $item.addClass('click');
            __ContextMenu.addContextItem($item,
                'Switch Visibility',
                function () {
                    $item.trigger('click');
                })

                .addContextSeparater($item, 'Geometry')
                .addContextItem($item,
                    'Show Geometry',
                    function () {
                        that.activeSettingTabHeader('Geometry');
                        Setting.setSelectedAxis(d.name);
                        __UI.createAxisGeometry();
                    })
                .addContextSpacer($item, 'Geometry')
                .addContextItem($item,
                    'Refresh Axis Window',
                    function () {
                        refresh();
                    })
                .addContextItem($item, 'Highlight Axis')
                .adjust($item);

            $item.on('click', function (evt) {
                d.active = !$item.hasClass('click');
                if (!d.active) $item.removeClass('click');
                else $item.addClass('click');
                __RadvisController.adjustAxis();
            });

        });
    },
    createAxisGeometry: function () {
        let axisName =
            _.isNil(Setting.getSelectedAxis())
                ? __data.numericKeys[0] : Setting.getSelectedAxis();
        Setting.setSelectedAxis(axisName);

        __UI.$settingTab.$contents.empty();
        __UI.$settingTab.$bottom.empty();

        let currentAxis = __data.findAxis(axisName);
        let $contents = __UI['$settingTab']['$contents'];

        let sortedAxis = __data.getSortedAxis();
        // Add Dropdown
        let listItem = [];
        listItem.push('^#visible');
        _.forEach(_.filter(sortedAxis, function (d) {
            return d.active;
        }), function (d) {
            listItem.push(d.name);
        });
        listItem.push('^#invisible');
        _.forEach(_.filter(sortedAxis, function (d) {
            return !d.active;
        }), function (d) {
            listItem.push(d.name);
        });

        createComponentDropDown($contents, {
            name: 'Axis Selector',
            desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            listItem: listItem,
            selected: axisName,
        }, function (val) {
            Setting.setSelectedAxis(val);
            __UI.createAxisGeometry();
        });

        let $graphic = $('<div class="graphic"></div>').appendTo($contents);
        let $desc = $('<div class="desc"></div>').appendTo($graphic);
        let $head = $('<div class="head"></div>').appendTo($desc);
        let $body = $('<div class="body"></div>').appendTo($desc);
        let sliders = [];
        _.forEach(Setting.Radvis.Axis.Geometry, function (v, k) {

            let slider = new ComponentSlider($contents, {
                name: v.name,
                value: currentAxis[k],
                min: v.min,
                max: v.max,
                desc: v.desc,
                step: v.step,
                connect: k,
            }, function (val) {
                currentAxis[k] = val;
                __RadvisController.adjustAxis();
            });
            console.log(v);
            sliders.push(slider);
        });

        __UI.createContentBottomIcon('undo', function () {
            const axis = __data.findAxis(Setting.getSelectedAxis());
            _.forEach(sliders, function (slider) {
                const key = slider.option.connect;
                const val = Setting.Radvis.Axis.Geometry[key].value;

                axis[key] = val;
                slider.update(val);
            });
            __RadvisController.adjustAxis();
        }, 'actor');
        $head.html(axisName);
        $body.html(currentAxis.stats.toString() + '<br>order:' + currentAxis.index);
    },

    createNodeGeometry: function () {
        __UI.$settingTab.$contents.empty();
        __UI.$settingTab.$bottom.empty();
        let $contents = __UI['$settingTab']['$contents'];

        let sliders = [];
        _.forEach(Setting.Radvis.Node.Geometry, function (v) {
            let slider = new ComponentSlider($contents, v, function (val) {
                //__RadvisController.adjustAxis();
                v.value = val;
                console.log(Setting.Radvis.Node.Geometry);
                __RadvisController.updateNodes();
            });
            sliders.push(slider);
        });

    },


    createContentBottomIcon: function (icon, action, additionalClass) {
        let $item = $('<div class="icon i material-icons">' + icon + '</div>').appendTo(__UI['$settingTab']['$bottom'])
        if (!_.isNil(additionalClass)) $item.addClass(additionalClass);
        $item.click(action);
        return $item;
    },
};


$(function () {

});


(function () {
    __UI.SideTab.push({
        Type: 'spacer',
    });
    __UI.SideTab.push({
        Type: 'Button', Name: 'Home', Icon: 'home', AppendClass: 'overview',
    });
    __UI.SideTab.push({
        Type: 'separater', Text: 'Clustering'
    });
    __UI.SideTab.push({
        Type: 'Button',
        Name: 'Make Cluster',
        Icon: 'bubble_chart',
        Tabs: {
            // Usage: "createAxisUsage",
            // Geometry: 'createAxisGeometry',
        }
    });
    //
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
