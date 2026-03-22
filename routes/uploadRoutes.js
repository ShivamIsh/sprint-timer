const express = require("express");
const uploadController = require("../controller/uploadController.js");
const upload = require("../middlewares/multer.js");


const router = express.Router();

router.post("/", upload.array("images", 10),uploadController.uploadImages);

module.exports = router;