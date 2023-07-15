const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const codeRoutes = require('./routes/code-routes');
const generateFile = require('./file-generator');
const passportSetup = require('./passport-setup/passport-setup');
const session = require('express-session');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

const cookieKey = process.env.COOKIE_KEY;
const mongoServer = process.env.MONGO_URI;

const app = express();

// set up view engine
app.set('view engine' , 'ejs');

app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use(session({
  secret: cookieKey,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}))

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


//connect to mongodb
mongoose.connect(mongoServer, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//setup Routes
app.use('/auth',authRoutes);
app.use('/code',codeRoutes);

// create home route
app.get('/',function(req,res){
    res.render('home');
})

app.listen(PORT,function(){
    console.log('Server is up and running!');
});

