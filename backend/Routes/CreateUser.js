const mongoose = require('mongoose');
const express=require('express')
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
const router=express.Router()
const User=require('../models/User')
const { body, validationResult } = require('express-validator');
const jwt=require("jsonwebtoken");

const bcrypt=require("bcryptjs");
const jwtSecret="Mynameisytchannelandiamheretoint"
router.post("/createuser", [
      body('email').isEmail(),//pass must be 5 characters long
      body('password').isLength({min:5}),
      body('name').isLength({min:5})]
     ,async(req, res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
        }
        const salt=await bcrypt.genSalt(10);
        let secPassword=await bcrypt.hash(req.body.password, salt)

    try {
        await User.create({
            name:req.body.name,
            password:secPassword,
            email:req.body.email,
            location:req.body.location
        })
    res.json({success:true});
    } catch(error) {
        console.log(error)
        res.json({success:false});

    }
    
})
router.post("/loginuser",[
    body('email').isEmail(),//pass must be 5 characters long
    body('password').isLength({min:5})],
    async(req, res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
        }
        
        const { email, password } = req.body;

  try {
     let userData= await User.findOne({email});
     if(!userData) {
        return res.status(400).json({errors:"try logging with correct credentials"})
     }

     const pwdCompare=await bcrypt.compare(req.body.password, userData.password)
     if(req.body.password !==userData.password) {
        return res.status(400).json({errors:"try logging with correct credentials"})
     }
     //we will send authorization token to the user and also verification later.

     const data={
        user:{
            id:userData.id //mongoDB se id lekar yahan save kara rahe hain.
        }
     }
     const authToken=jwt.sign(data, jwtSecret)
     return res.json({success:true,authToken:authToken})
  } catch(error) {
      console.log(error)
      res.json({success:false});

  }
  
})

module.exports=router;