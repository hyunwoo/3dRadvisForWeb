/**
 * Created by hyunwoo on 2017-02-15.
 */

let __data;
class DataAxis {
    constructor(name, index, stats) {
        this.active = false;
        this.name = name;
        this.spacing = Setting.Radvis.Axis.Geometry.spacing.value;
        this.spacing_center = Setting.Radvis.Axis.Geometry.spacing_center.value;
        this.uniqueIndex = this.index = index;
        this.stats = stats;
        this.power = Setting.Radvis.Axis.Geometry.power.value;

    }
}

class DataSet {
    constructor(csv, mode) {
        if (_.isNil(mode) || mode == 'csv') this.injectCsv(csv);
    }

    injectCsv(csv) {
        csv = csv.replace(/\r?\n|\r/gi, '\n');
        var rows = csv.split('\n');
        if (rows[rows.length - 1] == '')
            rows = _.dropRight(rows);
        this.keys = rows[0].split(',');
        // this.keys = _.take(rows[0].split(','), 15);
        this.raw = _.map(rows, function (row) {
            return row.split(',');
        });

        this.transposRaw = DataSet.TransposData(this.raw);
        var numeric = this.numeric = {};
        var stats = this.stats = {};
        var numericKeys = this.numericKeys = [];
        var currentInjectAxisCount = 0;
        _.forEach(this.transposRaw, function (d) {
            var values = _.map(_.drop(d), function (d) {
                return Number(d);
            });

            if (_.some(values, function (v) {
                    return isNaN(v);
                })) {
                return;
            }

            stats[d[0]] = {
                name: d[0],
                //value: values,
                min: _.min(values),
                max: _.max(values),
                // variance: _.variance(values),
                sigma: _.stdDeviation(values),
                median: _.median(values),
                mean: _.average(values),
            };
            numeric[d[0]] = values;
            // FOR TEST
            if (Setting.Test.AxisLimit) {
                if (currentInjectAxisCount < Setting.Test.AxisLimitCount) {
                    numericKeys.push(d[0]);
                    currentInjectAxisCount++;
                }
            } else numericKeys.push(d[0]);
        });
        console.log(numericKeys);

        this.numericNodes = [];
        for (var i = 0; i < numeric[numericKeys[0]].length; i++) {
            var out = {};
            _.forEach(this.numericKeys, function (k) {
                out[k] = numeric[k][i];
            });
            this.numericNodes.push(out);
        }

        this.axis = _.map(this.numericKeys, function (k, i) {
            return new DataAxis(k, i, stats[k]);
        });
    }

    getSortedAxis() {
        return _.sortBy(this.axis, function (axis) {
            return axis.index;
        })
    }

    findAxis(axisName) {
        return _.find(this.axis, function (axis) {
            return axis.name == axisName;
        })
    }

    findAxisByIndex(index) {
        return _.find(this.axis, function (axis) {
            return axis.index == index;
        })
    }

    static TransposData(matrix) {
        return _.map(matrix[0], function (col, i) {
            return _.map(matrix, function (row) {
                return row[i];
            })
        })
    }
}




