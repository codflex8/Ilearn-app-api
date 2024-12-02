"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekDays = exports.currentWeekDates = exports.getMonthStartAndEndDates = exports.getDayStartAndEndDates = exports.weekStartsOn = void 0;
exports.getWeeksInMonth = getWeeksInMonth;
const date_fns_1 = require("date-fns");
exports.weekStartsOn = 6;
const getDayStartAndEndDates = (date = new Date()) => {
    const dayStart = (0, date_fns_1.startOfDay)(new Date(date));
    // dayStart.setHours(0, 0, 0, 0);
    const dayEnd = (0, date_fns_1.endOfDay)(new Date(date));
    // dayEnd.setHours(23, 59, 59, 999);
    return { dayStart, dayEnd };
};
exports.getDayStartAndEndDates = getDayStartAndEndDates;
const getMonthStartAndEndDates = (date = new Date()) => {
    const monthStart = (0, date_fns_1.startOfMonth)(new Date(date));
    // dayStart.setHours(0, 0, 0, 0);
    const monthEnd = (0, date_fns_1.endOfMonth)(new Date(date));
    // dayEnd.setHours(23, 59, 59, 999);
    return { monthStart, monthEnd };
};
exports.getMonthStartAndEndDates = getMonthStartAndEndDates;
const currentWeekDates = (date = new Date()) => {
    // Define your week start day (e.g., Sunday or Monday)
    const startWeekDate = (0, date_fns_1.startOfWeek)(new Date(date), { weekStartsOn: exports.weekStartsOn }); // Monday as start of the week
    const endWeekDate = (0, date_fns_1.endOfWeek)(new Date(date), { weekStartsOn: exports.weekStartsOn });
    console.log(`Week starts on: ${startWeekDate}`);
    console.log(`Week ends on: ${endWeekDate}`);
    return { startWeekDate, endWeekDate };
};
exports.currentWeekDates = currentWeekDates;
const getWeekDays = (startWeekDate) => {
    const daysInWeek = 7;
    const days = Array.from({ length: daysInWeek }, (_, i) => {
        const dayStart = (0, date_fns_1.addDays)(startWeekDate, i);
        return {
            startDay: dayStart,
            endDay: (0, date_fns_1.endOfDay)(dayStart),
        };
    });
    return days;
};
exports.getWeekDays = getWeekDays;
function getWeeksInMonth(date) {
    const start = (0, date_fns_1.startOfMonth)(date);
    const end = (0, date_fns_1.endOfMonth)(date);
    // Get ISO week numbers for start and end of the month
    const startWeek = (0, date_fns_1.getWeek)(start);
    const endWeek = (0, date_fns_1.getWeek)(end);
    // Handle edge case for years where ISO weeks reset
    return endWeek >= startWeek
        ? endWeek - startWeek + 1
        : 53 - startWeek + endWeek + 1;
}
//# sourceMappingURL=Dates.js.map