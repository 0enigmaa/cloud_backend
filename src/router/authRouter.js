const router = require("express").Router()
const authCtrl=require("../controller/authCtrl")

router.post("/login",authCtrl.login)
router.post("/signup",authCtrl.signup)

module.exports=router