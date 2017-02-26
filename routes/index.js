var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/dev', function (req, res) {
    res.render('dev');
});

router.get('/testing', function (req, res) {
    res.render('radvis');
});

router.get('/radvis', function (req, res) {
    res.render('radvis');
});

router.get('/history', function (req, res) {
    res.render('history');
});

module.exports = router;
