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
    res.render('test_ui')
});

module.exports = router;
