'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by hyunwoo on 2017-02-15.
 */

var __data = void 0;

var DataAxis = function DataAxis(name, index, stats) {
    _classCallCheck(this, DataAxis);

    this.active = true;
    var that = this;
    this.name = name;
    this.spacing = 5;
    this.spacing_center = 0.5;
    this.index = index;
    this.stats = stats;
    this.power = 5;
    this.highlight = false;
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
            this.keys = rows[0].split(',');
            // this.keys = _.take(rows[0].split(','), 15);
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
                    sigma: _.stdDeviation(values), // ǥ������
                    median: _.median(values), // �߾Ӱ�
                    mean: _.average(values),

                    toString: function toString() {
                        return "min: " + __Formatter.number(this.min) + "<br>" + "max: " + __Formatter.number(this.max) + "<br>" + "sigma: " + __Formatter.number(this.sigma) + "<br>" + "mean: " + __Formatter.number(this.mean);
                    }
                };
                numeric[d[0]] = values;
                // FOR TEST
                if (Setting.Test.AxisLimit) {
                    if (Setting.Test.AxisLimitCount < 15) numericKeys.push(d[0]);
                } else numericKeys.push(d[0]);
            });

            this.numericNodes = [];
            for (var i = 0; i < numeric[numericKeys[0]].length; i++) {
                var out = {};
                _.forEach(this.numericKeys, function (k) {
                    out[k] = numeric[k][i];
                });
                this.numericNodes.push(out);
            }

            console.log(this.numericNodes);

            this.axis = _.map(this.numericKeys, function (k, i) {
                return new DataAxis(k, i, stats[k]);
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

function createAxisGeometry() {
    var graphicAxis = {
        $field: $tabAxis.find('.graphic'),
        $sliders: $tabAxis.find('input[type="range"]'),
        $slider_clear: $tabAxis.find('#axis-controller-clear'),
        desc: {
            $head: $tabAxis.find('.desc .head'),
            $body: $tabAxis.find('.desc .body')
        }
    };

    // create to
    graphicAxis.desc.$head.html(d.name);
    graphicAxis.desc.$body.html(d.stats.toString());

    _.forEach(graphicAxis.$sliders, function (ranger) {
        var $ranger = $(ranger);
        console.log($ranger.attr('data-name'), d[$ranger.attr('data-name')]);
        var val = d[$ranger.attr('data-name')];
        $ranger.val(val == undefined ? 0 : val);
    });

    graphicAxis.$slider_clear.unbind();
    graphicAxis.$slider_clear.click(function () {
        console.log('clear');

        _.forEach(graphicAxis.$sliders, function (ranger) {

            var $ranger = $(ranger);
            var key = $ranger.attr('data-name');
            if (!_.isNil(Setting.Radvis.Axis.Controller[key])) $ranger.val(Setting.Radvis.Axis.Controller[key]);
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
}

$.get('/data/credos_testing.csv', function (data) {
    __data = new DataSet(data);
    //createAxisVisibility();
    // Important! : Visualization Controlled based on Data
    createRadvis();
    __UI.injectData(__data);
    __UI.createSideTab();
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