const express = require('express')
var path = require('path');
const app = express();
const router = express.Router();
const { check, validationResult } = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
var mongoose = require("mongoose");

// Require model
var Product = require("./models/Product.js");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1/ecommerce", { useNewUrlParser: true });

const users = [
    {
        username: 'john',
        password: '080697',
        role: 'admin'
    }, {
        username: 'anna',
        password: 'password123member',
        role: 'member'
    }
];
const accessTokenSecret = '$2y$10$gIB2vAsorT/6vmMij4o.vO7dVJqOrVtxE.OO4R6FzWauUT6ozU3Pm';
// view file engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//setup public folder
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));
app.use(session({
    secret: 'secret-key',
    cookie: {
        secure: true,
        maxAge: 60000,
    },
    resave: false,
    saveUninitialized: false
}));

app.use(flash());app.use(session({
    secret: 'secret-key',
    cookie: {
        secure: true,
        maxAge: 60000,
    },
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
//home page
app.get('/',function (req, res) {
    res.render('pages/home')
});
//register page
app.get('/register',function (req, res) {
    res.render('pages/register')
});

app.post('/register', [
  check('name', 'name is required').not().isEmpty(),
  check('email', 'email is required').isEmail(),
  check('password', 'password is required').not().isEmpty(),
  check('phone', 'phone is required').not().isEmpty(),
  
],
  function (req, res) {
    const result = validationResult(req);
    var errors = result.errors;
	  //    for (var key in errors) {
	  //       console.log(errors[key].value);
	  // }
	const mydata={
		name :req.body.name,
		email:req.body.email,
		password:req.body.password,
		phone:req.body.phone
	}
	var data=Product(mydata);
	data.save(function(err){

   if (!result.isEmpty()){
	res.render('pages/register', {
      errors: errors
    })
   // res.json(errors);
   }
   else{
   	req.flash('msg', 'Data has created successfully!');
   	res.locals.messages = req.flash();
    res.render('pages/register');
  //res.json(message);
   }
  });
  });
//login page
app.get('/login',function (req, res) {
    res.render('pages/login')
});
app.post('/login', (req, res) => {
    // Read username and password from request body
    const { username, password } = req.body;

    // Filter user from the users array by username and password
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({ username: user.username}, accessTokenSecret);

        res.json({
            accessToken,message:"User login_in"
        });
    } else {
        res.send('Username or password incorrect');
    }
});

app.listen(3000);