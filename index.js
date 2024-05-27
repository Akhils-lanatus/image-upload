const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const app = express();
const port = 4000;
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.post("/uploading", upload.single("FieldName"), async (req, res, next) => {
  try {
    const filePath = path.join(__dirname, "uploads", req.file.filename);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "uploads",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    fs.unlinkSync(filePath);

    console.log("Uploaded file details: ", result);
    res.send("Uploaded");
  } catch (error) {
    console.log("File upload failed: ", error);
    res.status(500).send("File upload failed");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
