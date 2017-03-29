'use strict';

/**
 * Created by suhyun on 2017. 3. 5..
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/correlation', function (req, res, next) {
    res.render('correlation_graph');
});
router.get('/ui', function (req, res) {
    res.render('test_ui');
});

router.get('/joongang_alcohol', function (req, res) {
    res.render('joongang_alcohol');
});

module.exports = router;
//# sourceMappingURL=test.js.map