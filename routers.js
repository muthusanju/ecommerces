var express=require("express"); 
var bodyParser=require("body-parser"); 
var app=express();
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
var Image=require('./models/image.js');
var User=require('./models/User.js');
var session = require('express-session');
var multer = require('multer')
var path = require("path");
var bcrypt = require('bcryptjs');
const { check, validationResult,matchedData} = require('express-validator');
const router=express.Router();

const jwt = require("jsonwebtoken");
mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true}); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
  console.log("connection succeeded"); 
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json()); 
//sessions
app.use(session({
secret: "it is my secret",
resave: false,
saveUninitialized: true,
cookie: {
maxAge: 300000
}
}));


app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
  extended: true
})); 
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


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json()); 


app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
  extended: true
})); 
//logout
router.get('/logout',function(req,res){
delete req.session.userid;
res.redirect('login');
});

//home page clone panrathu theriyala pola ungalu
router.get('/',function (req, res) {
  
  res.render('pages/home');

});


//home page clone panrathu theriyala pola ungalu
router.get('/userdetails',function (req, res) {
  var result;
  User.find({},function(err,result){
  res.render('pages/userdetails',{result:result});
});

});

//home page clone panrathu theriyala pola ungalu
router.post('/userdetails',function (req, res) {
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

//GET login
router.get('/login',function (req, res) {
    res.render('pages/login');
});

//POST login page
router.post("/login",function (req, res){

   var email=  req.body.email;
   var password= req.body.password;
   const mydata={
        'email': email,
        'password': password
  };
        
  User.findOne(mydata, function(err,result){
     var resJson = {};
    console.log(result);
    if(err){
      resJson.status='fail';
      resJson.resType = 'Error';
      resJson.resMsg = 'Error occured, please try again.';
      resJson.err = err;
      
    } else if(result!=null) {
var token=jwt.sign({mydata}, 'my_secret_key', { expiresIn: '1h'}, {algorithm: "HS256"});
  console.log("token:",token);
  // req.session.user = email;
  req.session.userid = result._id;
  // req.session.token=token;
  // req.session.sessionkey = result.id;
  
      resJson.status='success';
      resJson.resType = 'Success';
      resJson.resMsg = 'login succes.';
      // res.render('loginpage',{message:"successful"});
    }else{
        
      // res.json({'status':'empty',message:"Invalied Input"});
      resJson.status = 'empty';
      resJson.message = 'Invalid Input';
    }
    res.json(resJson);
    });
  });


//get register page
router.get('/register',function (req, res) {
var result;
  User.find({},function(err,result){
     
  res.render('pages/register',{result:result});
});
});

router.get('/demo', function(req, res) {
   //res.render('pages/demo');
  
    console.log('searchh : ',req.body);

    var name=req.body.productname;
    //console.log( "/^" + name+"/");
    Image.find({ 'productname': new RegExp(name, 'i') } ,function(err, items) {
      //usermodel.find({name}, function(err,result){
    if(err){

    }else if(items!=null){
      var passDateJson = {};
         console.log('items:',items);

      
      console.log("inside");
     //res.json({'status':'FETCH',message:result});

          passDateJson.resType = 'success';
          passDateJson.resMsg = items;
        }
    res.json(passDateJson);
    });
       
});
//post register
router.post('/register',function(req,res){ 

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

router.post("/userdetails/edit/:id",function (req, res) {
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
router.get('/userdetails/:id', function(req, res, next) {    
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

router.get('/product',function (req, res) {
  var result;
 Image.find({},function(e,result){
        res.render('pages/product', {
            "result" : result
        });
    });
});

//post product
router.post('/product',upload,function(req, res, next){
  var img=profileImage[0].name;
  var amount=req.body.amount;
  var discount=req.body.discount;
  var productname=req.body.productname;
new Image({
    image  :  img,
    amount : amount,
    discount:discount,
    productname:productname
  }).save(function(err, doc){
    
    var passDateJson = {};   
    if(err){
      passDateJson.resType='error';
      passDateJson.resMsg ='Error occured';
      passDateJson.err    = err;
    }else{
      passDateJson.resType='success';
      passDateJson.resMsg ='Record Addes Successfully';
  
    }
res.json(passDateJson);

});
});
//edit product
router.post("/product/edit/:id",function (req, res) {
  var o_id       = new ObjectId(req.params.id)
  var productname= req.body.productname; 
  var amount     = req.body.amount; 
  var discount   = req.body.discount; 
  var img        = req.body.image;

  var data       = { 
      "name"     : productname, 
      "amount"   : amount, 
      "discount" : discount,
      'image'    : img
  } 
  
  
  db.collection('images').findOneAndUpdate({_id:o_id}, { $set: data },{new:true}, function (err, result1) {
     
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
router.get('/product/:id', function(req, res, next) {    
    var o_id = new ObjectId(req.params.id);
    db.collection('images').remove({"_id": o_id}, function(err, result) {
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
router.get('/cart', function(req, res, next) {    
        var result;
  Image.find({},function(err,result){
     
res.render('pages/productdetails',{result:result});
});
});
router.get('/productdetails',function(req,res){
  var result;
  Image.find({},function(err,result){
     
res.render('pages/productdetails',{result:result});
});
});
module.exports=router;