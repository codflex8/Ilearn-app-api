export function getMonthName(month: number): string {
  //   console.log("monthhhhhh", month);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month - 1];
}

export const getDailyActivity = (
  results,
  startYear: number,
  startMonth: number
) => {
  const filledData = [];
  for (let i = 0; i <= 4; i++) {
    const year = new Date(startYear, startMonth + i).getFullYear();
    const month = (startMonth + i) % 12;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const existingData = results.find(
        (r) => r.year === year && r.month === month + 1 && r.day === day
      );
      filledData.push({
        year,
        month: month + 1,
        day,
        monthName: getMonthName[month + 1],
        totalCount: existingData ? Number(existingData.totalCount) : 0, // Default to 0 if no activity
      });
    }
  }
  return filledData;
};
