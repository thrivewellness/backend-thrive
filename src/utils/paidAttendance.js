const PAID_ATTENDANCE_SKIPPED_WEEKDAYS = new Set([0, 4]); // Sunday, Thursday

const getDatePart = (dateValue) => String(dateValue ?? "").slice(0, 10);

const parseCalendarDate = (dateValue) => {
  const datePart = getDatePart(dateValue);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return null;

  const [year, month, day] = datePart.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};

const formatDate = (date) => date.toISOString().slice(0, 10);

export const isPaidAttendanceSkippedDay = (dateValue) => {
  const date = parseCalendarDate(dateValue);

  return date ? PAID_ATTENDANCE_SKIPPED_WEEKDAYS.has(date.getUTCDay()) : false;
};

export const getPaidAttendanceWeekDates = (dateValue) => {
  const date = parseCalendarDate(dateValue);

  if (!date) return [];

  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  const monday = new Date(date);
  monday.setUTCDate(monday.getUTCDate() - daysSinceMonday);

  return Array.from({ length: 7 }, (_, index) => {
    const trackerDate = new Date(monday);
    trackerDate.setUTCDate(monday.getUTCDate() + index);
    return formatDate(trackerDate);
  });
};

export const getValidPaidAttendanceDates = (attendance = []) => [
  ...new Set(
    (Array.isArray(attendance) ? attendance : [])
      .map(getDatePart)
      .filter((date) => parseCalendarDate(date) && !isPaidAttendanceSkippedDay(date))
  ),
];
