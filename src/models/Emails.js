const mongoose=require("mongoose");

const emailSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})

const Email=new mongoose.model("EMAIL",emailSchema);
module.exports=Email;