const express = require('express'),
    pug = require('pug'),
    path = require('path'),
    routes = require('./routes/routes.js');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser("whatever"));
const expressSession = require('express-session');
const { urlencoded } = require('express');
app.set('view engine', "pug")
app.set('views', __dirname + '/views')
app.use(express.static(path.join(__dirname, '/public')));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept')
    next();
});
app.use(expressSession({
    secret: 'wh4t3v3r',
    saveUninitialized: true,
    resave: true
}))

const urlencodedParser = express.urlencoded({
    extended: false
});

app.get('/login', (req, res) => {
    visited++;
    // first parameter is the alias for the variable and value you're passing in.
    // second parameter is the varibale that holds a value.
    // last parameter is an object for the maxAge of the cookie
    res.cookie('stuff', myString, { maxAge: 99999999999999999999999 });
    //res.send(`Hello ${req.cookies.stuff}.`);
    res.cookie('visited', visited, { maxAge: 99999999999999999999999 })
    res.cookie()
    if (req.cookies.beenHereBefore == 'yes') {
        res.send(`you have been here ${req.cookies.visited} times`)
    } else {
        res.cookie("beenHereBefore", 'yes', { maxAge: 99999999999999999999999 })
        res.send(`This is you first time here`)
        visited = 0;
    }
});
app.post('/home', urlencodedParser, (req, res) => {
    console.log(req.body.username)
    if (req.body.username == 'user' && req.body.password == 'pass') {
        req.session.user = {
            isAuthenticated: true,
            username: req.body.username
        }
        res.redirect('/private')
    } else {
        res.redirect('/')
    }

    res.redirect('/')
})

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/')
        }
    })
})

app.get('/', routes.main);
app.get('/create', routes.loadCreate);
app.get('/invalid', routes.Invalid);

app.post('/create', urlencodedParser, routes.createAccount);

app.listen(3000);

