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
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadDirectory = path_1.default.join(__dirname, "../public/images");
        if (!fs_1.default.existsSync(uploadDirectory)) {
            // If not, create it
            fs_1.default.mkdirSync(uploadDirectory, { recursive: true });
        }
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const mimeType = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        if (mimeType && extname) {
            return cb(null, true);
        }
        cb(new ApiError_1.default("Only images are allowed", 400));
    },
});
//# sourceMappingURL=uploadFiles.js.map