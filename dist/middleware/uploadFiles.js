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
// Define the storage configuration
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const isImage = file.mimetype.startsWith("image/");
        const isAudio = file.mimetype.startsWith("audio/");
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
        // Create the directory if it doesn't exist
        if (!fs_1.default.existsSync(uploadDirectory)) {
            fs_1.default.mkdirSync(uploadDirectory, { recursive: true });
        }
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
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
    if (allowedTypes.includes(file.mimetype)) {
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