'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by hyunwoo on 2017-02-15.
 */

var __data = void 0;

var DataAxis = function DataAxis(name, index) {
    _classCallCheck(this, DataAxis);

    this.active = true;
    this.name = name;
    this.weight = 1;
    this.index = index;
};

var DataSet = function () {
    function DataSet(csv, mode) {
        _classCallCheck(this, DataSet);

        if (_.isNil(mode) || mode == 'csv') this.injectCsv(csv);
    }

    _createClass(DataSet, [{
        key: 'injectCsv',
        value: function injectCsv(csv) {
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
                    // variance: _.variance(values), // �л�
                    // sigma: _.stdDeviation(values), // ǥ������
                    // median: _.median(values), // �߾Ӱ�
                    mean: _.average(values)
                };
                numeric[d[0]] = values;
                // FOR TEST
                if (numericKeys.length < 15) numericKeys.push(d[0]);
            });

            this.numericNodes = [];
            for (var i = 0; i < numeric[numericKeys[0]].length; i++) {
                var out = {};
                _.forEach(this.numericKeys, function (k) {
                    out[k] = numeric[k][i];
                });
                this.numericNodes.push(out);
            }
            console.log(numericKeys);
            this.axis = _.map(this.numericKeys, function (k, i) {
                return new DataAxis(k, i);
            });
        }
    }], [{
        key: 'TransposData',
        value: function TransposData(matrix) {
            return _.map(matrix[0], function (col, i) {
                return _.map(matrix, function (row) {
                    return row[i];
                });
            });
        }
    }]);

    return DataSet;
}();

function createAxisController() {
    _.forEach(__data.axis, function (d, i) {
        console.log(d);
        var $item = $('<div class="item click">' + d.name + '</div>');
        $item.appendTo('#AxisController');

        var evt = Rx.Observable.fromEvent($item, 'click');
        evt.subscribe(function () {
            d.active = !$item.hasClass('click');
            if (!d.active) $item.removeClass('click');else $item.addClass('click');
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
//# sourceMappingURL=radvis.data.js.map