'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by hyunwoo on 2017-03-21.
 */

var _ = require('lodash');
var pcorr = require('compute-pcorr');

var DataSet = function () {
    function DataSet(csv, mode) {
        _classCallCheck(this, DataSet);

        if (_.isNil(mode) || mode == 'csv') this.injectCsv(csv);
    }

    _createClass(DataSet, [{
        key: 'injectCsv',
        value: function injectCsv(csv) {
            csv = csv.replace(/\r?\n|\r/gi, '\n');
            var rows = csv.split('\n');
            if (rows[rows.length - 1] == '') rows = _.dropRight(rows);
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
                    max: _.max(values)
                };
                numeric[d[0]] = values;
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
        }
    }, {
        key: 'getSortedAxis',
        value: function getSortedAxis() {
            return _.sortBy(this.axis, function (axis) {
                return axis.index;
            });
        }
    }, {
        key: 'findAxis',
        value: function findAxis(axisName) {
            return _.find(this.axis, function (axis) {
                return axis.name == axisName;
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

var Iconv = require('iconv').Iconv;
var iconv = new Iconv('EUC-KR', 'UTF-8//TRANSLIT//IGNORE');
var reviconv = new Iconv('UTF-8//TRANSLIT//IGNORE', 'EUC-KR//TRANSLIT//IGNORE');
var fs = require('fs');
var d = iconv.convert(fs.readFileSync('./joongang_alcohol_merged_corr.csv')).toString('UTF-8');

var dset = new DataSet(d.toString());

var surveyKeys = ['BDI', 'BAI', 'MAST', 'AUQ-K1', 'VAS-A1', 'FTND', 'VAS_S1', 'AUQ-K2', 'VAS-A2', 'VAS-S2', '입원환자', 'NS_원', 'NS_T', 'NS_백', 'HA_원', 'HA_T', 'HA_백', 'RD_원', 'RD_T', 'RD_백', 'P_원', 'P_T', 'P_백', 'NS1', 'NS2', 'NS3', 'NS4', 'HA1', 'HA2', 'HA3', 'HA4', 'RD1', 'RD2', 'RD3', 'RD4', 'P1', 'P2', 'P3', 'P4'];

var testKeys = dset.numericKeys;
_.forEach(surveyKeys, function (k) {
    testKeys = _.without(testKeys, k);
});
// console.log(surveyKeys)
// console.log(testKeys)

var result = {};
var invResult = {};
_.forEach(surveyKeys, function (td) {
    var corr = _.map(testKeys, function (d) {
        return {
            name: d,
            corr: pcorr([dset.numeric[d], dset.numeric[td]])[0][1]
        };
    });
    // corr = _.filter(corr, (d) => {
    //     return Math.abs(d.corr) > 0.3
    // });
    corr = _.sortBy(corr, function (d) {
        return -Math.abs(d.corr);
    });

    corr = _.take(corr, 10);

    result[td] = corr;
});

var csv = 'source,target,corr\n';
// console.log(result);
_.mapKeys(result, function (v, k) {
    _.forEach(v, function (vv) {
        csv += k + ',' + vv.name + ',' + vv.corr + '\n';
    });
});
fs.writeFileSync('./corrs.csv', reviconv.convert(csv));

//
// _.forEach(testKeys, (td) => {
//     var corr = _.map(surveyKeys, (d) => {
//         return {
//             name: d,
//             corr: pcorr([dset.numeric[d],
//                 dset.numeric[td]])
//                 [0][1],
//         }
//     });
//     // corr = _.filter(corr, (d) => {
//     //     return Math.abs(d.corr) > 0.3
//     // });
//     corr = _.sortBy(corr, (d) => {
//         return -Math.abs(d.corr)
//     });
//
//     corr = _.take(corr, 10);
//     invResult[td] = corr;
// });
/*
 fs.writeFileSync('../public/data/joongang_alcohol.js',
 `var surveyKeys=${JSON.stringify(surveyKeys)};` +
 `var testKeys=${JSON.stringify(testKeys)};` +
 `var corrs=${JSON.stringify(result)};` +
 `var invCorrs=${JSON.stringify(invResult)};`);*/
//# sourceMappingURL=serve_data_testing.js.map