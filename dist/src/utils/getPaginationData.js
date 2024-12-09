"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationData = void 0;
const getPaginationData = ({ page, pageSize, }) => {
    const take = pageSize !== null && pageSize !== void 0 ? pageSize : 10;
    const skip = ((page !== null && page !== void 0 ? page : 1) - 1) * take;
    return { skip, take };
};
exports.getPaginationData = getPaginationData;
//# sourceMappingURL=getPaginationData.js.map