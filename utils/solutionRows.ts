/** Accepted answers as Solution rows: song 1 is part 1, song 2 part 2. */
export function toSolutionRows(
  solutions: string[] = [],
  solutions2: string[] = []
) {
  return [
    ...solutions.map((solution) => ({ solution, part: 1 })),
    ...solutions2.map((solution) => ({ solution, part: 2 })),
  ];
}
