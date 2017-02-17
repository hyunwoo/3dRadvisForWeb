/**
 * Created by hyunwoo on 2017-02-15.
 */

let __data;

class DataAxis {
    constructor(name, index) {
        this.active = true;
        this.name = name;
        this.weight = 1;
        this.index = index;
    }

}

class DataSet {
    constructor(csv, mode) {
        if (_.isNil(mode) || mode == 'csv') this.injectCsv(csv);
    }

    injectCsv(csv) {
        var rows = csv.split('\n');
        this.keys = _.take(rows[0].split(','), 15);
        this.raw = _.map(rows, function (row) {
            return row.split(',');
        });
        this.transposRaw = DataSet.TransposData(this.raw);
        var numeric = this.numeric = {};
        var stats = this.stats = {};
        var numericKeys = this.numericKeys = [];
        _.forEach(this.transposRaw, function (d) {
            var values = _.map(_.drop(d), function (d) {
                return Number(d);
            });

            if (_.some(values, function (v) {
                    return isNaN(v);
                })) return;

            stats[d[0]] = {
                value: values,
                min: _.min(values),
                max: _.max(values),
                // variance: _.variance(values), // 분산
                // sigma: _.stdDeviation(values), // 표준편차
                // median: _.median(values), // 중앙값
                mean: _.average(values),
            };
            numeric[d[0]] = values;
            // FOR TEST
            if (numericKeys.length < 15)
                numericKeys.push(d[0]);
        });


        this.numericNodes = [];
        for (var i = 0; i < numeric[numericKeys[0]].length; i++) {
            var out = {};
            _.forEach(this.numericKeys, function (k) {
                out[k] = numeric[k][i];
            });
            this.numericNodes.push(out);
        }
        console.log(numericKeys)
        this.axis = _.map(this.numericKeys, function (k, i) {
            return new DataAxis(k, i);
        });


    }

    static TransposData(matrix) {
        return _.map(matrix[0], function (col, i) {
            return _.map(matrix, function (row) {
                return row[i];
            })
        })
    }


}


function createAxisController() {
    _.forEach(__data.axis, function (d, i) {
        console.log(d);
        var $item = $('<div class="item click">' +
            d.name +
            '</div>');
        $item.appendTo('#AxisController');

        var evt = Rx.Observable.fromEvent($item, 'click');
        evt.subscribe(() => {
            d.active = !$item.hasClass('click');
            if (!d.active) $item.removeClass('click');
            else $item.addClass('click');
            __RadvisController.adjustAxis();
        });
    });
}

$.get('/data/credos_testing.csv', function (data) {
    __data = new DataSet(data);
    createAxisController();
    // Important! : Visualization Controlled based on Data
    createRadvis();
    // create2DViewer();
    //createParallel();
});

$(function () {
    $('#axisColorApplier').click(function () {
        Setting.Radvis.Axis.Color = 0xFF0000;
        __RadvisController.updateAxisColor(new THREE.Color(Setting.Radvis.Axis.Color));
    });
});
