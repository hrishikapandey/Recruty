const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const {User} = require("../schema/user.schema");
const { createConnection } = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const {checkSchema , check} = require("express-validator");
// register any user 
router.post("/register",checkSchema({
    email: { isEmail: true },
    password: { isLength: { options: { min: 8 } } },
  }),async (req,res)=>{
    const {name, email, password} = req.body;
    // const result = await checkSchema({
    //     email: { isEmail: true,errorMessage: "Please enter a valid email"},
    //     password: { isLength: { options: { min: 8 } },errorMessage: "password must contain at least 8 characters long" },
    //   }).run(req.body);
    // const emailResult = await check("email").isEmail().run(req.body);
    // const passwordResult = await check("password").isLength({min : 8}).run(req.body);
    //   console.log(emailResult, passwordResult);
    //   return;
     
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({name,email,password:hashedPassword});
    await user.save();
    res.status(201).json({message: "User created successfully"})
})
//get all user
router.get(("/"), async (req,res)=>{
    const users = await User.find().select("-password");
 
    res.status(200).json(users);
});
//get user by email
router.get("/email", async(req, res) => {
    const {email} = req.params;
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({message: "User not found"})
    }
    res.status(200).json(user);
})

//login user

router.post("/login", async(req, res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({message: "Wrong email or password"});
    }
   const isPasswordMatch = await bcrypt.compare(password, user.password);
   if(!isPasswordMatch){
    return res.status(404).json({message: "Wrong email or password"});
   }
   const payload = {id: user._id};
   const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET);
  res.status(200).json({token});
})



module.exports= router;
