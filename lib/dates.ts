const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// "2026-05" → "May 2026". Done by hand so the server and browser always agree,
// whatever their locale or time zone.
export function formatMonth(month: string) {
  const [year, index] = month.split("-");
  return `${months[Number(index) - 1]} ${year}`;
}

// "2026-10-29" → "29 Oct 2026", by hand for the same reason.
export function formatDay(day: string) {
  const [year, month, date] = day.split("-");
  return `${Number(date)} ${months[Number(month) - 1]} ${year}`;
}
