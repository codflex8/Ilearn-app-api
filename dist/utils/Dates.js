"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayDates = void 0;
const getTodayDates = () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    return { todayStart, todayEnd };
};
exports.getTodayDates = getTodayDates;
//# sourceMappingURL=Dates.js.map