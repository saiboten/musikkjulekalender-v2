export function getToday() {
  const now = new Date();
  now.setUTCHours(8, 0, 0, 0);

  return now;
}
