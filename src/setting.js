/**
 * Created by hyunwoo on 2017-02-16.
 */
let Setting = {
    Radvis: {
        Height: 800,
        Radius: 400,
        NodeSize: 10,
        NodeScale: 1.5,
        Background: 0xffffff,
        Axis: {
            Color: 0xaaaaaa,
            Geometry: {
                spacing: {
                    value: 5,
                    type: 'slider',
                    min: 1,
                    max: 10,
                },
                spacing_center: {
                    value: 5,
                    type: 'slider',
                    min: 1,
                    max: 10,
                },
                power: {
                    value: 5,
                    type: 'slider',
                    min: 1,
                    max: 10,
                },
            },
        },
        Geometry: {
            BasketCount: 180,
        }
    },

    ParallelCoordinate: {
        Background: 0xeeeeee,
    },

    Test: {
        AxisLimit: false,
        AxisLimitCount: 15,
    }
};

$(function () {
    const inputs = $('input[data="setting"]');
    inputs.on('change', function () {
        const $this = $(this);
        const keys = $this.attr('data-name').split(' ');
        let temp = Setting;
        _.forEach(_.dropRight(keys), function (key) {
            temp = temp[key];
        });
        temp[_.takeRight(keys)] = $this.val();
        console.log(temp);
        eval($this.attr('update'));
    });
});
