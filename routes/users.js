const express = require('express')
const router = express.Router()
const passport = require('passport')
const mongoose = require('mongoose')

const User = require('../models/User')

//login
router.get('/login', (req, res) => res.render('login'))

// Login
router.post('/login', (req, res, next) => {
     var email= req.body.email
     if(email.includes('faculty')){
      passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/users/login',
        failureFlash: true
      })(req, res, next)
     }else{
      if(email.includes('student')){
        passport.authenticate('local', {
          successRedirect: '/Student',
          failureRedirect: '/users/login',
          failureFlash: true
        })(req, res, next)
      }
     }
  })

//logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

//attendance
router.get('/attendance', (req, res, next) =>{
  User.find({"name": req.user.name}, (err, Users) =>{
    if(err){
      console.log(err)
    }else{
      res.render('attendance', {
        usersArray: Users
      })
    }
  })
  
})

//attendance handel
router.post('/attendance', (req, res, next) =>{
  const teacher_name = req.user.name
  const { date, value } = req.body
  var n = value.length
  var i = 0

  User.find({ "name": teacher_name, "attendance.status.date": date}, {_id:0 , "attendance.name": 1})
  .then(result =>{
    if(result.length > 0){
      req.flash('message', 'already exists')
      res.redirect('/users/attendance')
    }
   
   else{
    for(i=0; i<n; i++){
       if(value[i] == 0 || value[i] == 1){
       const student_name = req.user.attendance[i].name
       const query1 = {"name": teacher_name, "attendance.name": student_name}
       const query2 = {$push: {"attendance.$.status": {date: date, value: value[i]}} }        
       User.updateOne(query1, query2, (err, docs) =>{
         if(err){
           res.status(404).send('There is error.........')
         }else{
           next()
         }
       })
     }else{
       req.flash('bit_msg', 'worng input')
       res.redirect('/users/attendance')
     }
   }
   res.redirect('/users/attendance')
  }
  }).catch((err) => (console.log(err)))

})

//Teachet Attendance
router.get('/T_Attendance_view', (req, res) =>{
  var name = req.user.name
  User.find({"name": name}, (err, doc) =>{
    if(err){
      console.log(err)
    }else{
      res.render('T_Attendance_view',{
        usersArray: doc
      })
    }
  })
})


//student view handle
router.post('/Student_view', (req, res) => {
  var department = req.body.department
  const match_Q = {$match: {"department": department}}
  const filter_Q = {$filter: {input: "$attendance", as: "attendance", cond: {$eq: ["$$attendance.name", req.user.name]}}}
  User.aggregate([ match_Q, {$project: {result: filter_Q, "department":1}}], (err, result) =>{
    if(err){
      console.log(err)
    }else{
      res.render('Student_view', {
         usersArray: result
      })
    }
  })
})

module.exports = router