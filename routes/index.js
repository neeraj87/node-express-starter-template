var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Login'
    });
});

router.get('/signin', (req, res) => {
    res.redirect('/');
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('crmuser-local-login', function(err, user, info){
		if(err) {return next(err);}
		if(!user) {
			var message = info.message;
            res.render('index', {
                layout: false,
                title: 'Login',
                showMessageBox: true,
                message : message.text
            });
			return;
		}
		req.login(user, function(err){
            if(err) {return next(err);}
			return res.redirect('/customers');
		});
	})(req, res, next);
});


module.exports = router;