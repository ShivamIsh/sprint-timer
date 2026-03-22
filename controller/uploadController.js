const multer = require("multer");
const path = require("path");
const fs = require("fs");



const uploadImages = (req, res)=>{
     try {
    // multer adds files here
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const filePaths = files.map(file => file.path);

    res.status(200).json({
      message: "Files uploaded successfully",
      files: filePaths
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

module.exports = {uploadImages};