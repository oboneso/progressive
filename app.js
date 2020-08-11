const expressLayouts = require('express-ejs-layouts');
const MongoClient = require('mongodb').MongoClient;
const session = require('express-session');
const flash = require('connect-flash')
const mongoose = require('mongoose');
const passport = require('passport');
var EventEmitter = require('events')
const express = require('express');
const logger = require('morgan');
const path = require('path');
const cors = require('cors')
var util = require('util')
const app = express();
const CONFIG = require('./config');
const google = require('googleapis').google;
const jwt = require('jsonwebtoken');
const OAuth2 = google.auth.OAuth2;

app.use(cors());

// Passport Config
require('./config/passport')(passport);

const cookieParser = require("cookie-parser");
app.use(cookieParser());


/*          - - - - - - - - - - - -
            // DATABASE SECTION //
           - - - - - - - - - - - -                  */
const db = require('./config/keys').MONGO_URI;

// Connect to Mongo via Mongoose
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB Connected...')
  })
  .catch((err) => {
    console.log(err)
  });


const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function () {

  connection.db.collection("users", function (err, collection) {
    collection.find({}).toArray(function (err, users) {
      console.log(); // it will print your collection data
    })
  });

});


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Express Body-Parser
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;

  next();
});

app.use(setUser);

app.use(cookieParser());

function setUser(req, res, next) {
  const userId = req.body.userId;
  if (userId) {
    req.user = users.find(user => user.id === userId)
  }
  next()
}

app.get('/oauth2callback', (req, res) => {
  const oauth2client = new OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0]
  )
  if (req.query.error) {
    // User didn't grant permission
    return res.redirect('/users/youtube')
  } else {
    oauth2client.getToken(req.query.code, (err, token) => {
      if (err) return res.redirect('/users/youtube');

      res.cookie('jwt', jwt.sign(token, CONFIG.JWTsecret))

      return res.redirect('/users/subscription_list')
    })
  }
})

app.get('/.well-known/pki-validation/CE280DC890098AC71F3E31E297C7272F.txt', (req, res) => {
  console.log(req.body)
  res.send('This is the ssl page')
})




app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');

  next()
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));



const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
