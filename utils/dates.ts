export function getToday() {
  const now = new Date();
  now.setUTCHours(-2, 0, 0, 0);

  return now;
}
