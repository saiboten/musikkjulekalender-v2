export function calculatePoints(hints: boolean[]) {
  const hintsUsed = hints.filter((el) => el).length;

  switch (hintsUsed) {
    case 0:
      return 5;
    case 1:
      return 3;
    case 2:
      return 2;
    case 3:
      return 1;
    default:
      1;
  }
}
