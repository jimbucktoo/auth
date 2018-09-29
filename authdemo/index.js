var express = require('express');
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");

mongoose.connect("mongodb://localhost/auth_demo_app", { useNewUrlParser: true });

var app = express();
app.use(require("express-session")({
    secret: "jimbucktoo",
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=================================================================================

//Routes

app.get('/', function(req, res){
    res.render('index');
});

app.get('/secret', isLoggedIn, function(req, res){
    res.render('secret');
});

//Auth Routes

//Sign Up Routes

app.get("/register", function(req, res){
    res.render('register');
});

app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err) {
            console.log(err);
            res.send("Register Post Route.");
        } else {
            passport.authenticate('local')(req, res, function(){
                res.redirect('/secret'); 
        });
            console.log(User);
            res.send("Register Post Route.");
        } 
    });

});

//Sign In Routes

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), function(req, res){
    
});

//Sign Out Route

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    };
};

//Server Initialization
app.listen(3000, function() {
    console.log("Serving on port 3000.");
});
