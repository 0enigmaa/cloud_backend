const router = require("express").Router()
const userCtrl=require("../controller/userCtrl")

router.get("/",userCtrl.getAll)
router.get("/:id",userCtrl.getOne)

module.exports=router