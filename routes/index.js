var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/testing', function (req, res) {
    res.render('radvis');
});

router.get('/radvis', function (req, res) {
    res.render('radvis');
});

module.exports = router;
