"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.s3Upload = exports.dynamicStorage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const uploadToAws_1 = require("../utils/uploadToAws");
const iconv_lite_1 = __importDefault(require("iconv-lite"));
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
const documentsExtensions = [
    ".txt",
    ".csv",
    ".log",
    ".md",
    ".doc",
    ".docx",
    ".pdf",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
];
// Define the storage configuration
const localStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const extension = path_1.default.extname(file.originalname);
        const isImage = imagesExtensions.includes(extension);
        const isAudio = audioExtensions.includes(extension);
        const isDocument = documentsExtensions.includes(extension);
        let uploadDirectory = "";
        if (isImage) {
            uploadDirectory = path_1.default.join(__dirname, "../public/images");
        }
        else if (isAudio) {
            uploadDirectory = path_1.default.join(__dirname, "../public/audio");
        }
        else if (isDocument) {
            uploadDirectory = path_1.default.join(__dirname, "../public/documents");
        }
        else {
            return cb(new Error("Unsupported file type"), null);
        }
        createDirIfNotExist(uploadDirectory);
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const originalNameWithoutExt = path_1.default.parse(file.originalname).name;
        const filename = iconv_lite_1.default.decode(Buffer.from(uniqueSuffix +
            "_" +
            originalNameWithoutExt +
            path_1.default.extname(file.originalname), "utf-8"), "utf-8");
        // Determine the relative path for the file
        const extension = path_1.default.extname(file.originalname).toLowerCase();
        const isImage = imagesExtensions.includes(extension);
        const isAudio = audioExtensions.includes(extension);
        const isDocument = documentsExtensions.includes(extension);
        let relativePath;
        if (isImage)
            relativePath = `/public/images/${filename}`;
        if (isAudio)
            relativePath = `/public/audio/${filename}`;
        if (isDocument)
            relativePath = `/public/documents/${filename}`;
        // Add the path to req.body using the field name
        req.body[file.fieldname] = relativePath;
        cb(null, filename);
    },
});
// Updated file filter with additional file extensions
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        ...imagesExtensions,
        ...audioExtensions,
        ...documentsExtensions,
    ];
    const extension = path_1.default.extname(file.originalname);
    if (allowedTypes.includes(extension)) {
        cb(null, true);
    }
    else {
        cb(new ApiError_1.default("Invalid file type. Only images , audio and documents files are allowed", 400), false);
    }
};
const s3Storage = (0, multer_s3_1.default)({
    s3: uploadToAws_1.s3,
    acl: "public-read",
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
        const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
        cb(null, `${fileName}${path_1.default.extname(file.originalname)}`);
    },
});
exports.dynamicStorage = {
    _handleFile(req, file, cb) {
        if (file.fieldname === "file") {
            // Use S3 for "file" field
            return s3Storage._handleFile(req, file, cb);
        }
        else if (file.fieldname === "image") {
            // Use local storage for "image" field
            return localStorage._handleFile(req, file, cb);
        }
        else {
            cb(new Error("Unsupported field name"));
        }
    },
    _removeFile(req, file, cb) {
        if (file.fieldname === "file") {
            // Use S3's remove logic if needed
            const s3Storage = (0, multer_s3_1.default)({
                s3: uploadToAws_1.s3,
                acl: "public-read",
                bucket: process.env.AWS_BUCKET_NAME,
            });
            return s3Storage._removeFile(req, file, cb);
        }
        else if (file.fieldname === "image") {
            // Use local storage's remove logic
            return localStorage._removeFile(req, file, cb);
        }
        else {
            cb(new Error("Unsupported field name"));
        }
    },
};
// Create the multer upload instance
exports.s3Upload = (0, multer_1.default)({
    storage: exports.dynamicStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50 MB limit
});
// Create the multer upload instance
exports.upload = (0, multer_1.default)({
    storage: localStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50 MB limit
});
//# sourceMappingURL=uploadFiles.js.map