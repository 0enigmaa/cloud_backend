const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const fileupload = require("express-fileupload")
const cors = require('cors')

dotenv.config()

//import routers
const imgRouter = require("./src/router/imgRouter")
const authRouter = require("./src/router/authRouter")
const userRouter = require("./src/router/userRouter")
const categoryRouter = require("./src/router/categoryRouter")
//
const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileupload({ useTempFiles: true }))

// use router

app.use("/api/image", imgRouter)
app.use("/api", authRouter)
app.use("/api/user", userRouter)
app.use("/api/category", categoryRouter)

const MONGO_URL = process.env.MONGO_URL
mongoose.connect(MONGO_URL).then(
   () => {
      app.listen(PORT, () => {
         console.log(` Server running on port: ${PORT}`);
      })
   }
).catch(error => {
   console.log('server.js 27-line', error);

})


