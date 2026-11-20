import { Heading } from "./ui";
import { FrontPageBox } from "./FrontPageBox";
import { Spacer } from "./lib/Spacer";
import type { DayStats as Stats } from "../utils/dayStats";

const percent = (share: number) =>
  `${Math.round(share * 100).toLocaleString("nb-NO")} %`;

function duration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} t ${rest} min` : `${hours} t`;
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <p>
      <span className="font-bold">{label}:</span> {children}
    </p>
  );
}

const splitLabels = [
  [5, "Uten hint"],
  [3, "Etter hint 1"],
  [2, "Etter hint 2"],
  [1, "Etter hint 3"],
] as const;

export function DayStats({
  stats,
  className,
}: {
  stats: Stats;
  className?: string;
}) {
  const { guesses } = stats;
  const dual = stats.partialCount !== null;

  return (
    <FrontPageBox className={className}>
      <Heading size="md">Statistikk</Heading>
      <Spacer multiply={0.5} />

      {stats.partialCount ? (
        <Row label="Fant én av to sanger">
          {stats.partialCount}{" "}
          {stats.partialCount === 1 ? "person" : "personer"}
        </Row>
      ) : null}
      {stats.solvedCount === 0 && !stats.partialCount ? (
        <p>Ingen har løst denne ennå.</p>
      ) : stats.solvedCount === 0 ? null : (
        <>
          <Row label={dual ? "Fant begge sangene" : "Løst av"}>
            {stats.solvedCount}{" "}
            {stats.solvedCount === 1 ? "person" : "personer"}
            {stats.solveRate !== null
              ? ` (${percent(stats.solveRate)} av aktive spillere)`
              : null}
          </Row>
          {stats.firstSolver ? (
            <Row label="Første løser">
              {stats.firstSolver.name},{" "}
              {duration(stats.firstSolver.minutesAfterOpen)} etter start
            </Row>
          ) : null}
          {stats.medianMinutes !== null ? (
            <Row label="Median løsetid">{duration(stats.medianMinutes)}</Row>
          ) : null}

          <Spacer multiply={0.5} />
          <p className="font-bold">
            Poengfordeling{dual ? " (per sang funnet)" : ""}:
          </p>
          <ul className="ms-4">
            {splitLabels.map(([points, label]) => (
              <li key={points}>
                {label} ({points} p): {stats.pointsSplit[points]}
              </li>
            ))}
          </ul>
        </>
      )}

      {guesses ? (
        <>
          <Spacer multiply={0.5} />
          <Row label="Gjetting">
            {guesses.total.toLocaleString("nb-NO")} gjett fra {guesses.players}{" "}
            {guesses.players === 1 ? "spiller" : "spillere"} ·{" "}
            {percent(guesses.solvedPercent)} fikk det til
            {guesses.avgPerSolver !== null
              ? ` · ${guesses.avgPerSolver.toLocaleString("nb-NO", {
                  maximumFractionDigits: 1,
                })} gjett per løser`
              : null}
          </Row>
        </>
      ) : null}
    </FrontPageBox>
  );
}
