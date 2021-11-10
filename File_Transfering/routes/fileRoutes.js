const express = require("express");
const router = express.Router();
const controller = require("../controllers/fileController");

router.get("/", controller.getListFiles);
router.get("/:name", controller.download);
router.post("/", controller.upload);

module.exports = router;