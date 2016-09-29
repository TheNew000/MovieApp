var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoUrl = 'mongodb://localhost:27017/ecommerce';
mongoose.connect(mongoUrl);
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var randToken = require('rand-token');
var stripe = require('stripe')('config.secretTestKey');
//The config module which gives you access to config.secretTestKey
var config = require('../config/config'); 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req,res,next){

    User.findOne({
        username: req.body.username
    }, function(error, document){
        if (document == null){
            // username is not registered yet proceed forward do nothing
        }else{
            // else display warning that the username is already taken
        }
    })


    var token = randToken(32);
    var userToAdd = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        email: req.body.email,
        token: token
        // tokenExpDate:
    });
    userToAdd.save(function(error, docAdded){
        if(error){
            res.json({
                message: "errorAdding"
            });
        }else{
            res.json({
                message: "successAdded",
                token: token
            });
        }
    });

    res.json({message: 'Added: ' + req.body.username});
});

router.post('/login', function(req,res,next){
    User.findOne({username: req.body.username},
        function (error, document){
            if(document == null){
                // No Match
                res.json({failure:'noUser'});
            }else{
                // first param is the english password the second param is the hash returns a boolean
                var loginResult = bcrypt.compareSync(req.body.password, document.password);
                if(loginResult){
                    res.json({success: 'userFound'});
                }else{
                    res.json({failure: 'badPass'})
                }
            }
        }
    );
});

router.post('/options')

router.get('getUserData', function(req, res, next){
    var userToken = req.query.token; //the XXX in ?token=XXXXX
    if(userToken == undefined){
        //No Token Was Supplied
        res.json({failure: 'noToken'});
    }else{
        User.findOne({
            token: userToken
        }, function(error, document){
            if(document == null){
                res.json({failure: 'badToken'});
            }else{
                res.json({
                    username: document.username,
                    grind: document.grind,
                    frequency: document.frequency,
                    token: document.token
                })
            }
        });
    }
});

router.post('/stripe', function(req,res,next){
    stripe.charges.create({
        amount: req.body.amount,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: req.body.email
    }).then((charge) => {
        res.json({success: 'paid'});
    }, (err) => {
        res.json({failure: "failedPayment"});
    });
});

module.exports = router;
