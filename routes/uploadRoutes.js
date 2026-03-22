const express = require("express");
const uploadController = require("../controller/uploadController.js")

const router = express.Router();

router.post("/", uploadController.uploadImages);

module.exports = router