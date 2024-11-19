"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const createDirIfNotExist = (dir) => {
    if (!fs_1.default.existsSync(dir)) {
        // If not, create it
        fs_1.default.mkdirSync(dir, { recursive: true });
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
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const extension = path_1.default.extname(file.originalname);
        const isImage = imagesExtensions.includes(extension);
        const isAudio = audioExtensions.includes(extension);
        let uploadDirectory = "";
        if (isImage) {
            uploadDirectory = path_1.default.join(__dirname, "../public/images");
        }
        else if (isAudio) {
            uploadDirectory = path_1.default.join(__dirname, "../public/audio");
        }
        else {
            return cb(new Error("Unsupported file type"), null);
        }
        createDirIfNotExist(uploadDirectory);
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = uniqueSuffix + path_1.default.extname(file.originalname);
        // Determine the relative path for the file
        const extension = path_1.default.extname(file.originalname).toLowerCase();
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
    const extension = path_1.default.extname(file.originalname);
    console.log("fileeee", file, extension);
    if (allowedTypes.includes(extension)) {
        cb(null, true);
    }
    else {
        cb(new ApiError_1.default("Invalid file type. Only images and audio files are allowed", 400), false);
    }
};
// Create the multer upload instance
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50 MB limit
});
//# sourceMappingURL=uploadFiles.js.map