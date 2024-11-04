"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateWithoutTime = void 0;
const getDateWithoutTime = (date) => {
    return date.toISOString().split("T")[0];
};
exports.getDateWithoutTime = getDateWithoutTime;
//# sourceMappingURL=getDateWithoutTime.js.map