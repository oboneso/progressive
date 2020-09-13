const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const passport = require('passport')
const methodOverride = require('method-override')
const colors = require('colors')
const moment = require('moment')
const morgan = require('morgan')
const dotenv = require('dotenv')
const errorHandler = require('./middleware/error')

//  Database config
const connectDB = require('./config/db')

dotenv.config({ path: './config/config.env' })
connectDB()

//
const app = express()

//  Dev loggig middleware
app.use(morgan('dev'))

//  Passport Config
require('./config/passport')(passport)

//  Flash Messages
const flashSetup = (req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.deleted_msg = req.flash('deleted_msg')
  next()
}

//  Global Middlewares
app.use(methodOverride('_method'))
app.use(express.json())
app.use(expressLayouts)
app.use(express.static(`${__dirname}/public`))
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(flash())
app.use(flashSetup)

//  Routes | Paths
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users/users'))
app.use('/blog', require('./routes/blog'))
app.use('/profile', require('./routes/profile'))
app.use('/media', require('./routes/media'))
app.use('/exercises', require('./routes/exercises'))
app.use('/friends', require('./routes/friends'))

// app.use(cors());

app.use(errorHandler)

app.set('view engine', 'ejs')

// app.get('/oauth2callback', (req, res) => {
//   const oauth2client = new OAuth2(
//     CONFIG.oauth2Credentials.client_id,
//     CONFIG.oauth2Credentials.client_secret,
//     CONFIG.oauth2Credentials.redirect_uris[0]
//   )
//   if (req.query.error) {
//     // User didn't grant permission
//     return res.redirect('/users/youtube')
//   } else {
//     oauth2client.getToken(req.query.code, (err, token) => {
//       if (err) return res.redirect('/users/youtube');

//       res.cookie('jwt', jwt.sign(token, CONFIG.JWTsecret))

//       return res.redirect('/users/subscription_list')
//     })
//   }
// })

// DB source code UDEMY: Node.js API Masterclass. #19
const PORT = process.env.PORT || 8081
const server = app.listen(PORT, () => {
  console.log(`Server started in ${process.env.NODE_ENV} mode on PORT: ${PORT}`.yellow.bold)
})
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close server and exit process
  server.close(() => {
    process.exit(1)
  })
})

// const setUser = (req, res, next) => {
//   const userId = req.body.userId;
//   if (userId) {
//     req.user = users.find(user => user.id === userId)
//   }
//   next()
// }

/** REMOVED CODE
 *
 * Re: Database
 * const MongoClient = require('mongodb').MongoClient;
 *
 * Re: YouTube/Google Api
 * const CONFIG = require('./config');
 * const google = require('googleapis').google;
 * const jwt = require('jsonwebtoken');
 * const OAuth2 = google.auth.OAuth2;
 *
 *
 *
 *
 */
// c
