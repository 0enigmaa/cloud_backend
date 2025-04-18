const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
firstname:{
    type:String,
    required:true
},
lastname:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    min:10
},
password:{
    type:String,
    required:true
},
role:{
    type:String,
    default:100,
    enum:[100,101], //100-user 101-admin
},
profilePicture:{
    type:String,
    default:""
},


},{timestamps:true})

module.exports=mongoose.model("User",userSchema)
