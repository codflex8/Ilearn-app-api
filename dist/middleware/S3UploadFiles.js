"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const uploadToAws_1 = require("../utils/uploadToAws");
const path_1 = __importDefault(require("path"));
exports.s3Upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: uploadToAws_1.s3,
        acl: "public-read",
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
            cb(null, `${fileName}${path_1.default.extname(file.originalname)}`);
        },
    }),
});
//# sourceMappingURL=S3UploadFiles.js.map