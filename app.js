require('dotenv').config();

var express = require('express');                                
var exphbs = require('express-handlebars');
var router = express.Router();                                    
var bodyParser = require('body-parser');
var session = require('express-session');                         
var http = require('http');
var path = require('path');
var winston = require('winston');
var hbs = exphbs.create({
    helpers: require('./handlers/handlebars'), //create a handlebars.js helper file
    defaultLayout: 'main',
    extname:'.hbs'
});
//routes
var index = require('./routes/index');
var app = express();
//express session option settings (only if we want to maintain session)
const hour = 3600000; //one hour
var sessionOptions = {
    secret: 'thesecretkeythatyouwant',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + hour),
        maxAge: hour
    }
};
app.engine('.hbs', hbs.engine);        
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('partials', path.join(__dirname, 'views/partials'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
if(app.get('ENV') === 'production') {
    sessionOptions.cookie.secure = true;
}
// required for passport
app.use(session(sessionOptions));
//called on every route
app.use(function(req, res, next) {
    next();
});
app.use('/', index);
//404 error
app.use((req, res, next) => {
    res.status(404);
    // respond with html page
    if(req.accepts('html')) {
        res.render('404', {
            layout: 'home',
            title: 'Page Not Found',
        });
        return;
    }
    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not found');
});
//500 error
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('500', { error: err });
});
process.on('uncaughtException', function (err) {
    winston.log('info', '-------------- UNCAUGHT EXCEPTION: ' + err);
    winston.log('info', '------------- ERROR STACK -------------');
    winston.log('info', err.stack);
    winston.log('info', '---------------------------------------');
});

//create server and listen to the port
http.createServer(app).listen(app.get('port'), function(){
    winston.log('info', 'The server has started');
});
module.exports = app;
