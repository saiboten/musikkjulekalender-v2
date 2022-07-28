export function getToday() {
  const now = new Date();
  now.setUTCHours(7, 0, 0, 0);

  return now;
}
