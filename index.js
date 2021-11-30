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
app.use(express.static(path.join(__dirname + '/public')));
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept')
//     next();
// });
app.use(expressSession({
    secret: 'wh4t3v3r',
    saveUninitialized: true,
    resave: true
}))

const urlencodedParser = express.urlencoded({
    extended: false
});

// app.get('/login', (req, res) => {

//     //res.send(`Hello ${req.cookies.stuff}.`);

//     res.send(`The last time that you was here was ${req.cookies.LastVisit}.`)
//     res.clearCookie(LastVisit)
//     res.cookie('LastVisit', dateTime, { maxAge: 99999999999999999999999 });
// });

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/')
        }
    })
})
const checkAuth = (req, res, next) => {
    if (req.session.user && req.session.user.isAuthenticated) {
        console.log("Everything is authenticated")
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        // first parameter is the alias for the variable and value you're passing in.
        // second parameter is the varibale that holds a value.
        // last parameter is an object for the maxAge of the cookie
        res.cookie('LastVisit', dateTime, { maxAge: 99999999999999999999999 });
        next();
    } else {
        res.redirect('/');
    }
}



app.get('/', routes.main);
app.get('/create', routes.loadCreate);
app.get('/invalid', routes.Invalid);
app.get('/login', routes.login);
app.get('/welcome', checkAuth, routes.welcome);
app.post('/create', urlencodedParser, routes.createAccount);
app.post('/login', urlencodedParser, routes.loginAccount, (req, res) => {
    req.session.user = {
        isAuthenticated: true,
        username: req.body.username
    }
    console.log("Created Session")
    res.redirect('/welcome')
});


app.listen(3000);

