var express=require("express"); 
var bodyParser=require("body-parser"); 
var app=express();
var path = require('path');
const { check, validationResult,matchedData} = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
var User=require('./module/User.js');
mongoose.connect('mongodb://localhost:27017/mydb'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
  console.log("connection succeeded"); 
}) 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json()); 

app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
  extended: true
})); 
app.use(flash());
app.use(session({
    secret: "super-secret-key",
    key: "super-secret-cookie",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  }));
//home page
app.get('/',function (req, res) {
    res.render('pages/home')
});

//GET login
app.get('/login',function (req, res) {
    res.render('pages/login')
});
//POST login page
app.post("/login",function(req, res){
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

  });


//get register page
app.get('/register',function (req, res) {
var result;
  User.find({},function(err,result){
     console.log('result:',result);
  res.render('pages/register',{result:result});
});
});
//post register
app.post('/register', [
    check("name").isLength({ min: 5 }).withMessage("name is required").trim(),
    check("email").isEmail().withMessage("email is required").bail().trim().normalizeEmail(),
    check("password").isLength({ min:5 }).withMessage("password is required").trim(),
    check("phone").isLength({ min:10 }).withMessage("phone no is required").trim(),
  ],
  function(req,res){ 
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
  
const errors = validationResult(req);

db.collection('users').insertOne(data,function(err, collection){ 
  
var passDateJson = {};
if(err){
   passDateJson.resType='error';
   passDateJson.resMsg ='Error occured';
   passDateJson.err    = err;
}else{
    passDateJson.resType='success';
   passDateJson.resMsg ='Register Successfully';
  
}
res.json(passDateJson);

 });

}); 

app.post("/register/edit/:id",function (req, res) {
  var id = req.body.id;
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
  console.log(data);
  db.collection('users').findOneAndUpdate({_id:id}, { $set: data },{new:true}, function (err, result1) {
     
var passDateJson = {};
if(err){
   passDateJson.resType='error';
   passDateJson.resMsg ='Error occured';
   passDateJson.err    = err;
}else{
    passDateJson.resType='success';
   passDateJson.resMsg ='Updated Successfully';
  
}
res.json(passDateJson);

  });
});

app.listen(3000);

console.log("server listening at port 3000"); 
