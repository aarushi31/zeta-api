const express=require("express");
const app=express();
const User=require('./models/Users');
const PORT=process.env.PORT||3000;
require("./db/connect");
const bcrypt=require("bcryptjs");
const serverless = require('serverless-http');


app.use(express.json());
app.use(express.urlencoded({extended:false}));
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("Hello world");
});

router.post("/register",async (req,res)=>{
    try{
        console.log(req.body.name);
        const userData=new User({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            phone:req.body.phone,
            password:req.body.password,
            accType:req.body.accType
        })
        console.log(req.body.email)
        const loginData=await User.findOne({email:req.body.email});
        if(loginData)
        {
            return res.json({message:"Email already registered"})
        }
        //password hashing->register.js
        //token
        
        //const token=await userData.generateAuthToken();
        // console.log(token);

        const result=await userData.save();
        res.status(201).json({message:"Signedup successfully"})
        
    }catch(err){
        res.status(400).json({message:"error"});
        console.log(err)
    }
})


//login check
router.post("/login",async (req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;

        console.log(`${email} and ${password}`);
        const loginData=await User.findOne({email:req.body.email});

        const isMatch=await bcrypt.compare(password,loginData.password);
        
        //token
        console.log(loginData)
        const token=await loginData.generateAuthToken();
        // console.log(token);

        res.cookie("jwt",token,{
            // expires:new Date(Date.now() + 50000),
            httpOnly:true,
        });

        if(isMatch)
        {
            res.status(201).json({message:"Logged in successfully"});
        }else if(!isMatch)
        {
            res.json({message:"Oops! Incorrect credentials"})
        }
        else{
            res.json({message:"This account is not registered"});
        }
    }
    catch(err)
    {
        res.status(400).json({message:"Error logging in"});
    }
})


router.get('/logout',(req,res)=>{
    console.log("Logged out");
    res.clearCookie("jwt",{path:'/'});
    res.status(200).send("User logged out");
})

app.use('/.netlify/functions/server', router); 

module.exports = app;
module.exports.handler = serverless(app);
// app.listen(PORT,()=>{
//     console.log(`Server running at Port ${PORT}`);
// })