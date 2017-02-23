'use strict';

/**
 * Created by hyunwoo on 2017-02-16.
 */
var Setting = {
    Radvis: {
        Height: 800,
        Radius: 400,
        NodeSize: 10,
        NodeScale: 1.5,
        Background: 0xffffff,
        Node: {
            Geometry: { // component
                size: {
                    value: 5,
                    type: 'slider',
                    name: 'Node Size',
                    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    min: 1,
                    max: 20,
                    step: 0.1
                },
                scaling: {
                    value: 2,
                    type: 'slider',
                    name: 'Node Position Scaling',
                    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    min: 0,
                    max: 10,
                    step: 0.1
                }
            }
        },
        Axis: {
            Color: 0xaaaaaa,
            Geometry: { // component
                spacing: {
                    value: 2,
                    type: 'slider',
                    name: 'Axis Spacing',
                    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    min: 1,
                    max: 10,
                    step: 0.1
                },
                spacing_center: {
                    value: 5,
                    type: 'slider',
                    name: 'Axis Center In Space',
                    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    min: 1,
                    max: 9,
                    step: 0.1
                },
                power: {
                    value: 3,
                    type: 'slider',
                    name: 'Axis Center Power',
                    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    min: 1,
                    max: 25,
                    step: 0.1
                }
            },
            Visibility: {
                visible: true,
                invisible: false
            },
            SelectedGeometryAxis: undefined
        },
        Geometry: {
            BasketCount: 180
        }
    },

    ParallelCoordinate: {
        Background: 0xeeeeee
    },

    Test: {
        AxisLimit: false,
        AxisLimitCount: 15
    },

    setSelectedAxis: function setSelectedAxis(name) {
        Setting.Radvis.Axis.SelectedGeometryAxis = name;
    },
    getSelectedAxis: function getSelectedAxis() {
        return Setting.Radvis.Axis.SelectedGeometryAxis;
    }
};

$(function () {
    var inputs = $('input[data="setting"]');
    inputs.on('change', function () {
        var $this = $(this);
        var keys = $this.attr('data-name').split(' ');
        var temp = Setting;
        _.forEach(_.dropRight(keys), function (key) {
            temp = temp[key];
        });
        temp[_.takeRight(keys)] = $this.val();
        console.log(temp);
        eval($this.attr('update'));
    });
});
//# sourceMappingURL=setting.js.map