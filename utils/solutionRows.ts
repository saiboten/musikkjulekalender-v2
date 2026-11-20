/** Extra accepted answers as Solution rows, by song (part) and kind. */
export function toSolutionRows({
  solutions = [],
  artistSolutions = [],
  solutions2 = [],
  artistSolutions2 = [],
}: {
  solutions?: string[];
  artistSolutions?: string[];
  solutions2?: string[];
  artistSolutions2?: string[];
}) {
  const rows = (values: string[], part: number, kind: "song" | "artist") =>
    values.map((solution) => ({ solution, part, kind }));
  return [
    ...rows(solutions, 1, "song"),
    ...rows(artistSolutions, 1, "artist"),
    ...rows(solutions2, 2, "song"),
    ...rows(artistSolutions2, 2, "artist"),
  ];
}
