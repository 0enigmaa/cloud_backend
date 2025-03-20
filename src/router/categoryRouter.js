const router = require("express").Router()
const categoryCtrl = require("../controller/categoryCtrl")

router.post("/", categoryCtrl.addCategoty)
router.get("/", categoryCtrl.getAll)
router.get("/:id", categoryCtrl.getOne)
router.delete("/:id", categoryCtrl.deleteCategory)


module.exports = router