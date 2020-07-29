const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const employeerouter=require('./routers');
const app=express(); 
var multer = require('multer')
var path = require("path");
var session = require('express-session');
const jwt = require("jsonwebtoken");
mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true}); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
  console.log("connection succeeded"); 
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
secret: "it is my secret",
resave: false,
saveUninitialized: true,
cookie: {
maxAge: 300000
}
}));
app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
  extended: true
}));

app.use(async function (req, res, next) {
  res.locals = {};
  res.locals.session = req.session;
  // console.log('res.locals : ',res.locals);
  next();
});


app.use('/',employeerouter);
app.listen(3000);
console.log("server listening at port 3000"); 