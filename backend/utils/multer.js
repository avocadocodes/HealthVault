const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Define storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "doctor_profiles", // Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// Multer middleware
const upload = multer({ storage });

module.exports = upload;
