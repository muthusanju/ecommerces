var express=require("express"); 
var bodyParser=require("body-parser"); 
var app=express();
var fs = require('fs');
const { check, validationResult,matchedData} = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId
var User=require('./module/User.js');
var Image=require('./module/Image.js');
var multer = require('multer')
var path = require("path");
var util = require('util');
mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true }); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
  console.log("connection succeeded"); 
});
// Multer image start
var profileImage=[];
var storage = multer.diskStorage({
  destination:function(req,file,callback){
   callback(null,'./public/uploads');
  },
  filename:function(req,file,callback){
    var ext='';
    var name='';
    if(file.originalname){
      var p =file.originalname.lastIndexOf('.');
      ext=file.originalname.substring(p+1);
      var firstname=file.originalname.substring(0,p+1);
      name=Date.now()+'_'+firstname;
      name+=ext; 
    }
    profileImage=[];
    profileImage.push({'name':name});
    callback(null,name);
  }
});
var upload=multer({storage:storage,limits:{filesize:10}}).array('image');

app.get('/product',function (req, res) {
  var result;
 Image.find({},function(e,result){
        res.render('pages/product', {
            "result" : result
        });
    });
});

app.post('/product',upload,function(req, res, next){
  var img=profileImage[0].name;
  console.log(img);
new Image({
    image    :  img
  }).save(function(err, doc){
    console.log(doc);
    var passDateJson = {};   
    if(err){
      passDateJson.resType='error';
      passDateJson.resMsg ='Error occured';
      passDateJson.err    = err;
    }else{
      passDateJson.resType='success';
      passDateJson.resMsg ='Record deleted Successfully';
  
    }
res.json(passDateJson);

});
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json()); 

app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
  extended: true
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
app.post("/login",(req, res) => {
    const { name, password } = req.body;

      let result = {};
      let status = 200;
     
        User.findOne({name}, (err, user) => {
          if (!err && user) {
            // We could compare passwords in our model instead of below as well
            bcrypt.compare(password, user.password).then(match => {
              if (match) {
                status = 200;
                // Create a token
                const payload = { user: user.name };
                const options = { expiresIn: '2d', issuer: 'https://scotch.io' };
                const secret = process.env.JWT_SECRET;
                const token = jwt.sign(payload, secret, options);

                // console.log('TOKEN', token);
                result.token = token;
                result.status = status;
                result.result = user;
              } else {
                status = 401;
                result.status = status;
                result.error = `Authentication error`;
              }
              res.status(status).send(result);
            }).catch(err => {
              status = 500;
              result.status = status;
              result.error = err;
              res.status(status).send(result);
            });
          } else {
            status = 404;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
          }
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
new User({
    name    : req.body.name,
    email: req.body.email,
    password   : req.body.password,
    phone   : req.body.phone
  }).save(function(err, doc){
    var passDateJson = {};   
    if(err){
      passDateJson.resType='error';
      passDateJson.resMsg ='Error occured';
      passDateJson.err    = err;
    }else{
      passDateJson.resType='success';
      passDateJson.resMsg ='Record deleted Successfully';
  
    }
res.json(passDateJson);

  });

}); 

app.post("/register/edit/:id",function (req, res) {
  var o_id = new ObjectId(req.params.id)
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
  console.log(o_id);
  db.collection('users').findOneAndUpdate({_id:o_id}, { $set: data },{new:true}, function (err, result1) {
     
var passDateJson = {};
if(err){
   passDateJson.resType='error';
   passDateJson.resMsg ='Error occured';
   passDateJson.err    = err;
}else{
    passDateJson.resType='success';
   passDateJson.resMsg ='Profile Updated Successfully';
  
}
res.json(passDateJson);

  });
});
// DELETE USER
app.get('/register/:id', function(req, res, next) {    
    var o_id = new ObjectId(req.params.id)
    db.collection('users').remove({"_id": o_id}, function(err, result) {
    var passDateJson = {};   
    if(err){
      passDateJson.resType='error';
      passDateJson.resMsg ='Error occured';
      passDateJson.err    = err;
    }else{
      passDateJson.resType='success';
      passDateJson.resMsg ='Record deleted Successfully';
  
    }
res.json(passDateJson);

    });    
});
 
app.listen(3000);

console.log("server listening at port 3000"); 
