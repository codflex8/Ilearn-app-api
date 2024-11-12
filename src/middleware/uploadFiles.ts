import multer from "multer";
import path from "path";
import fs from "fs";
import ApiError from "../utils/ApiError";

const createDirIfNotExist = (dir: string) => {
  if (!fs.existsSync(dir)) {
    // If not, create it
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Define the storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isImage = file.mimetype.startsWith("image/");
    const isAudio = file.mimetype.startsWith("audio/");

    let uploadDirectory = "";
    if (isImage) {
      uploadDirectory = path.join(__dirname, "../public/images");
    } else if (isAudio) {
      uploadDirectory = path.join(__dirname, "../public/audio");
    } else {
      return cb(new Error("Unsupported file type"), null);
    }
    createDirIfNotExist(uploadDirectory);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Updated file filter with additional file extensions
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/tiff",
    "image/svg+xml",
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/mp3",
    "audio/webm",
    "audio/x-m4a",
    "audio/flac",
    "audio/aac",
    "audio/x-wav",
    "audio/x-aiff",
  ];
  console.log("fileeee", file);
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        "Invalid file type. Only images and audio files are allowed",
        400
      ),
      false
    );
  }
};

// Create the multer upload instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50 MB limit
});
