const express = require('express')
const dotenv = require('dotenv').config()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport');
const flash = require('connect-flash')
const session = require('express-session')

//Passport config
require('./config/passport')(passport)

const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000

const app = express()

connectDB();

// EJS 
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Badyparser
app.use(express.urlencoded({extended: false}))

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash())

// Global variables
app.use(function(req, res, next) {
    res.locals.user = req.user || null
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

//Routes app
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})