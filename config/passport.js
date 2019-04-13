var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const {User} = require('../config/db');

module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.uuid);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findByPk(id).then(user => {
            done(null, user);
        });
    });

    passport.use(
        'crmuser-local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            User.findOne({ where: {email: email} }).then(user => {
                if(user == null) {
                    return done(null, false, {message : {active : true, text : 'Incorrect Email or Password'}});
                }

                if(!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, {message : {active : true, text : 'Incorrect Email or Password'}});
                }

                return done(null, user);
            });
        })
    );
};
