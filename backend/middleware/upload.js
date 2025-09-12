import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryConfig, uploadConfig } from "../config/config.js";

// Configure Cloudinary
cloudinary.config(cloudinaryConfig);

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: uploadConfig.cloudinaryFolder,
    allowed_formats: uploadConfig.allowedFormats,
    transformation: [
      { width: 800, height: 600, crop: "limit" }, // Resize and crop images
      { quality: "auto" }, // Auto quality optimization
    ],
  },
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: uploadConfig.maxFileSize,
  },
});

// Middleware for single image upload
export const uploadSingle = upload.single("image");

// Middleware for multiple image uploads (if needed in future)
export const uploadMultiple = upload.array("images", 5);

// Error handling middleware for multer errors
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB.",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum is 5 files.",
      });
    }
  }
  
  if (error.message === "Only image files are allowed!") {
    return res.status(400).json({
      success: false,
      message: "Only image files are allowed!",
    });
  }
  
  next(error);
};

export default upload;
