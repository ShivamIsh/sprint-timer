const multer = require("multer");
const path = require("path");
// storage config
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({ storage }).array("images", 10);

const uploadImages = (req, res)=>{
    upload(req, res, function (err) {
    if (err) return res.status(500).json({ error: err });

    const filePaths = req.files.map(f => "/uploads/" + f.filename);

    res.json({
      message: "Uploaded",
      files: filePaths
    });
  });

}

module.exports = {uploadImages};