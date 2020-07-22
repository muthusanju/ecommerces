const express = require('express')
const path = require('path');
const app = express();
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const jwt = require('jsonwebtoken');
var bodyParser=require("body-parser"); 
const mongoose = require('mongoose'); 
const routes = require("./routes");

//connect moongoose db
mongoose.connect('mongodb://localhost:27017/ecommerce'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
  console.log("connection succeeded"); 
}) 

app.use("/", routes);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

//ejs view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//home page
 

app.listen(3000);