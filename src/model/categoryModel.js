const mongoose=require("mongoose")

const categorySchema=new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    categoryImage:{
        type:Object,
        required:true
    },
    ownerId:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }



    }   ,{timestamps:true}
)

module.exports=mongoose.model("Category",categorySchema)
