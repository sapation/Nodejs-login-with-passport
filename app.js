import express from "express";
import expressLayout from "express-ejs-layouts"
import flash from "connect-flash"
import session from "express-session"
import passport from "passport";

import dotenv from "dotenv";

dotenv.config();

//custom
import mainRouter from './routes/index.js'
import userRouter from './routes/users.js'
import Strategy  from './config/passport.js';


const app = express();

// passport config

Strategy(passport);
//EJS
app.use(expressLayout);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({extended: false}));

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

// Passport middleware
//app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
})


//Router
app.use('/', mainRouter);
app.use('/users', userRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
});