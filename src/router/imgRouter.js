const router = require("express").Router();
const imgCtrl = require("../controller/imgCtrl");

router.post("/", imgCtrl.addImg);
router.get("/:categoryId", imgCtrl.getAllImg);
router.get("/", imgCtrl.getImg);
router.delete("/:id", imgCtrl.deleteImg);

module.exports = router;