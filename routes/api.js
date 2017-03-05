/**
 * Created by hyunwoo on 2017-03-05.
 */
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Correlation = require('node-correlation');

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('API Status : Active');
});

router.post('/correlation', function (req, res) {
    console.log(req.body);
});

module.exports = router;
