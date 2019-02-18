var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Login'
    });
});

module.exports = router;