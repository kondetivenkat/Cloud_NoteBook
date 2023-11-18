const express = require('express');
const User = require('../models/User')
const {validationResult, body } = require('express-validator');
const router = express.Router();
const bcyrpt= require('bcryptjs');
const jwt =require('jsonwebtoken');
var fetchUser  = require('../middleware/fetchuser');
const JWT_secret = "hi!iam good boy";

//create user
router.post('/createuser',[
  body('name','enter valid name').isLength({min:3}),
  body('email','enter valid mail').isEmail(),
  body('password','password is atleast 5 length').isLength({min:5}),
],async (req,res)=>{
  let success=false;
   const errors = validationResult(req);
   if(!errors.isEmpty()){
     return  res.status(400).json({success,error:errors.array()})
   }
   try{
        let user = await User.findOne({success,email:req.body.email})
        if(user){
            res.status(400).json({error:"user alreday exist with this mail!"})
        }
        const salt = await bcyrpt.genSalt(10);
        const  pass = await bcyrpt.hash(req.body.password,salt);
        user = await User.create({
        name:req.body.name,
        password:pass,
        email:req.body.email,
        })
        const data = {
            user:{
                id:user.id
            }
        }
        const auth_token= jwt.sign(data,JWT_secret);
        success=true;
        res.json({success,authtoken:auth_token})
   }
   catch(err){
    res.status(400).json({error:err.message})
   }
})

//login the user
router.post('/login',[
  body('email','enter valid mail').isEmail(),
  body('password','password cannot blank').exists(),
],async(req,res)=>{
  let success=false;
  const errors = validationResult(req);
   if(!errors.isEmpty()){
     return  res.status(400).json({error:errors.array()})
   }
   try {
    const {email,password}=req.body;
    let user= await User.findOne({email});
    if(!user){
      return res.status(400).json({error:"user doesnot exist with this credntials"});
    }
    const pass= await bcyrpt.compare(password,user.password);
    if(!pass){
      success=false;
      return res.status(400).json({success,error:"user doesnot exist with this credntials"});
    }
    const data = {
      user:{
          id:user.id
      }
  }
  const auth_token= jwt.sign(data,JWT_secret);
  success=true;
  res.json({success,authtoken:auth_token})
   } catch (error) {
    res.status(500).json({error:error.message});
   }
})

//get logged in user details
router.post('/getuser',fetchUser,async (req,res)=>{
  try {
    const userId=req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).send("internal server error");
  }
})
module.exports = router;