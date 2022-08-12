const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
var fetchuser = require('../midleware/fetchuser')


var JWT_SECRET ="JaswinderS2412";

const { body, validationResult } = require("express-validator");

//create a use using post "/api/auth/createuser"
router.post(
    "/createuser",
    [
      body("email", "Enter Valid Email").isEmail(),
      body("password", "Paswword must be more than 5 char").isLength({ min: 5 }),
      body("name", "name length should be more than 3").isLength({ min: 3 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
          return res.status(400).json({ error: "Sorry Email Already Exist" });
        }
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password,salt);
  
        user = await User.create({
          name: req.body.name,
          password: secpass,
          email: req.body.email,
        });
        const data = {
          user:{
              id : user.id
          }
        }
  
        const jwtData = jwt.sign(data,JWT_SECRET);
  
        res.json({'auth_token':jwtData});
      } catch (err) {
        res.send({ error: err });
      }
      // .then(user => res.json(user)).
      // catch(err=>
      // res.json({'error':'Email must be unique','msg':err.message})
      // );
    }
  );
  
  
  //create a use using post "/api/auth/login"
  router.post(
    "/login",
    [
      body("email", "Enter Valid Email").isEmail(),
      body("password", "Password can not be blanked").exists(),
    ],
    async (req, res) => {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const {email,password} = req.body;
        let user = await User.findOne({ email: email });
        if (!user) {
          return res.status(400).json({ error: "Please try to login with correct credentials" });
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        // console.log(passwordCompare);
        if(!passwordCompare){
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const data = {
            user:{
                id : user.id
            }
          }
    
          const jwtData = jwt.sign(data,JWT_SECRET);
    
          res.json({'auth_token':jwtData});
      } catch (err) {
        res.send({ error: err });
      }
      
    }
  );

  //create a use using post "/api/auth/userdetails"
  router.post(
    "/userdetails",fetchuser,
    async (req, res) => {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");
    
          res.json({'auth_token':user});
      } catch (err) {
        res.send({ error: err });
      }
      
    }
  );

module.exports = router;
