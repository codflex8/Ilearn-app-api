"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setImageUrl = void 0;
const path_1 = __importDefault(require("path"));
const setImageUrl = (propertyName = "imageUrl") => (req, res, next) => {
    if (req.file) {
        req.body[propertyName] = path_1.default.join("public/images", req.file.filename);
    }
    if (req.files && !Array.isArray(req.files)) {
        Object.entries(req.files).map(([key, field]) => {
            req.body[key] = path_1.default.join("public/images", field[0].filename);
        });
    }
    next();
};
exports.setImageUrl = setImageUrl;
//# sourceMappingURL=setImageUrl.js.map