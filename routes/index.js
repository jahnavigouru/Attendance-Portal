const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = require('../models/User')
const { ensureAuthenticated } = require('../config/auth')

router.get('/', (req, res) => res.render('welcome'))

//teache home
router.get('/home', ensureAuthenticated, (req, res) => {
    User.find({}, (err, Users) =>{
        if(err){
          console.log(err)
        }else{
          res.render('home', {
            department: req.user.department,
            name: req.user.name,
            usersArray: Users
          })
        }
      })
})

//Teache home handel
router.post('/home', (req, res) => {
  var dep = req.user.department
  var department  = req.body.department
  if( department !== dep){
    req.flash('alret_msg', 'Please check ur department ')
    res.redirect('/home')
  }
  else{
    res.redirect('/users/attendance')
  }
})

//Student_home 
router.get('/student', (req, res) => {
  User.find({"attendance.name": req.user.name}, {_id:0, "department": 1}, (err, info)=>{
    if(err){
      console.log(err)
    }else{
      res.render('Student',{
        name: req.user.name,
        Array: info
      })
    }
  })
})


module.exports = router