const express = require('express');
var router = express.Router();
const path = require('path');
const app = express();
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const bodyParser=require("body-parser"); 
const mongoose = require('mongoose'); 

// var User=require('./routes/User.js');


//GET home page
router.get('/', function(req, res){
   res.render('pages/home')
});
//GET login page
router.get('/login', function(req, res){
   res.render('pages/login')
});
//POST login page

router.post('/login', function(req, res){
   res.render('pages/login')
});
mongoose.connect('mongodb://localhost:27017/mydb'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
  console.log("connection succeeded"); 
});

router.get('/register', function(req, res){
   var result;
   var name = req.body.name; 
  var email =req.body.email; 
  var pass = req.body.password; 
  var phone =req.body.phone; 

  var data = { 
    "name": name, 
    "email":email, 
    "password":pass, 
    "phone":phone 
  } 
db.collection('users').find(data,function(err, collection){ 
  
  // User.find({},function(err,result){
     console.log('result:',result);
  res.render('pages/register',{result:result});
});
});


//export this router to use in our index.js
module.exports = router;