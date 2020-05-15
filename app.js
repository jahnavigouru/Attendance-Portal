const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')


const app = express()

//passort
require('./config/passport')(passport)


// DB connection
const url = 'mongodb://localhost:27017/AttendancePortal'
mongoose.connect(url, ({useUnifiedTopology: true, useNewUrlParser: true}))
.then(() => console.log('DB connected!'))
.catch((err) => console.log(`DB connection error ${err}`))

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash())

//global variables
app.use((req, res, next) =>{
    res.locals.error = req.flash('error')
    res.locals.alret_msg = req.flash('alret_msg')
    res.locals.success_msg = req.flash('success_msg')
    res.locals.message = req.flash('message')
    res.locals.bit_msg = req.flash('bit_msg')
    
    next()
})

//routes 
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))


const PORT = process.env.PORT || 5050

app.listen(PORT, () => console.log(`Server running on ${PORT}..........`))