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

const imagesExtensions = [
  ".jpeg",
  ".jpg",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
  ".tiff",
  ".svg+xml",
  ".svg",
  ".heic",
  ".heif",
];
const audioExtensions = [
  ".mpeg",
  ".wav",
  ".aiff",
  ".ogg",
  ".amr",
  ".mp3",
  ".webm",
  ".x-m4a",
  ".flac",
  ".aac",
  ".x-wav",
  ".x-aiff",
  ".m4a",
  ".caf",
  ".opus",
];

// Define the storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const isImage = imagesExtensions.includes(extension);
    const isAudio = audioExtensions.includes(extension);
    let uploadDirectory = "";
    if (isImage) {
      uploadDirectory = path.join(__dirname, "../public/images");
    } else if (isAudio) {
      uploadDirectory = path.join(__dirname, "../public/audio");
    } else {
      return cb(new Error("Unsupported file type"), null);
    }
    createDirIfNotExist(uploadDirectory);

    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(file.originalname);

    // Determine the relative path for the file
    const extension = path.extname(file.originalname).toLowerCase();
    const isImage = imagesExtensions.includes(extension);
    const isAudio = audioExtensions.includes(extension);
    const relativePath = isImage
      ? `/public/images/${filename}`
      : `/public/audio/${filename}`;

    // Add the path to req.body using the field name
    req.body[file.fieldname] = relativePath;
    cb(null, filename);
  },
});

// Updated file filter with additional file extensions
const fileFilter = (req, file, cb) => {
  const allowedTypes = [...imagesExtensions, ...audioExtensions];
  const extension = path.extname(file.originalname);

  if (allowedTypes.includes(extension)) {
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
  limits: { fileSize: 100 * 1024 * 1024 }, // Increased to 50 MB limit
});
