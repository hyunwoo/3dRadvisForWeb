'use strict';

/**
 * Created by hyunwoo on 2017-03-05.
 */
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var Correlation = require('node-correlation');
var pcorr = require('compute-pcorr');
/* GET users listing. */
router.get('/', function (req, res) {
    res.send('API Status : Active');
});

router.post('/correlation', function (req, res) {

    var tr = req.body.numeric;
    var keys = _.keys(tr);

    var arr = [];
    _.forEach(keys, function (k) {
        arr.push(_.map(tr[k], function (d) {
            var n = Number(d);
            // if (_.isNaN(n)) n = 0;
            return n;
        }));
    });

    var corr = pcorr(arr);
    console.log(corr);
    res.json({
        keys: keys,
        corr: corr
    });
});

module.exports = router;
//# sourceMappingURL=api.js.map