/**
 * Created by hyunwoo on 2017-03-05.
 */

var _ = require('lodash');
const __Stats = new function () {

    this.correlation = function (a, b) {
        if (a.length != b.length) return null;
        const a_mean = _.mean(a);
        const b_mean = _.mean(b);
        console.log('mean', a_mean, b_mean);

        const length = a.length;

        var c = 0;
        var p_a = 0;
        var p_b = 0;
        for (var i = 0; i < length; i++) {
            c += (a[i] - a_mean) * (b[i] - b_mean);

            p_a += Math.pow((a[i] - a_mean), 2);
            p_b += Math.pow((b[i] - b_mean), 2);
        }

        var p = Math.sqrt(p_a * p_b);

        console.log(c, p, length);
        var cor = c / p;
        console.log(cor);
        return cor;
    };

    this.pCorrelation = function (a, b) {

    }
};

__Stats.correlation([1, 2, 3, 4], [1, 2, 3, 1]);