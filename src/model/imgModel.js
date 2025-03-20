const mongoose = require("mongoose")

const imgSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   imgPath:{
      type: Object,
      required: true
   },
   ownerId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   categoryId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
   }
}, {
   timestamps: true
})
module.exports = mongoose.model("Image", imgSchema)