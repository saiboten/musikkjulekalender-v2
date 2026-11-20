import React from "react";
import NextLink from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import Layout from "../../components/Layout";
import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../lib/generated/prisma/client";
import { requireAdmin } from "../../lib/requireAdmin";
import { Heading, cn } from "../../components/ui";

export default async function AdminPage() {
  const session = await requireAdmin();
  const role = session.user.role;

  const [users, allDays, daysWithSong] = await Promise.all([
    prisma.user.findMany({ orderBy: { id: "asc" } }),
    prisma.day.findMany({
      orderBy: { date: "asc" },
      include: dayInclude,
    }),
    // Only the ids: the song files themselves are large.
    prisma.songFile.findMany({
      where: { file: { not: "" } },
      select: { dayId: true },
    }),
  ]);

  const hasSong = new Set(daysWithSong.map((f) => f.dayId));

  // Admin sees all days, other roles only their own.
  const days =
    role === "admin" ? allDays : allDays.filter((day) => day.madeBy === role);

  const readyCount = days.filter(isReady).length;

  return (
    <Layout whiteBg>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <Heading size="lg">Admin</Heading>
        <p className="text-sm text-gray-600">
          <strong className="text-ink">{readyCount}</strong> av {days.length}{" "}
          dager er klare
        </p>
      </div>

      <section className="mt-6" aria-labelledby="days-heading">
        <Heading size="md" id="days-heading">
          Dager
        </Heading>
        <ul className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {days.map((day) => (
            <li key={day.id}>
              <DayCard day={day} hasSong={hasSong.has(day.id)} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="users-heading">
        <Heading size="md" id="users-heading">
          Brukere <span className="text-gray-500">({users.length})</span>
        </Heading>
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <li key={user.id}>
              <NextLink
                href={`/admin/user/${user.id}`}
                className="block h-full rounded-xl border border-gray-200 p-3 transition hover:border-primary hover:shadow-card"
              >
                <p className="truncate font-bold">
                  {user.nickname ?? user.name ?? "Uten navn"}
                </p>
                <p className="truncate text-sm text-gray-600">{user.email}</p>
                {user.role ? (
                  <Badge tone="neutral" className="mt-2">
                    {user.role}
                  </Badge>
                ) : null}
              </NextLink>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

const dayInclude = {
  solution: { select: { id: true, solution: true, part: true } },
  // Only the user ids: a player has two rows on dual-answer days.
  answers: { select: { userId: true } },
} satisfies Prisma.DayInclude;

type AdminDay = Prisma.DayGetPayload<{ include: typeof dayInclude }>;

const isEmpty = (value: string | null) =>
  !value?.trim() || value.trim() === "TBA";

function isFilledIn(day: AdminDay) {
  const song1 = !isEmpty(day.artist) && !isEmpty(day.song);
  const song2 = !isEmpty(day.artist2) && !isEmpty(day.song2);
  return song1 && (!day.dualAnswer || song2);
}

function songsOf(day: AdminDay) {
  const parts = day.dualAnswer ? [1, 2] : [1];
  return parts.map((part) => ({
    part,
    artist: part === 1 ? day.artist : day.artist2,
    song: part === 1 ? day.song : day.song2,
    solutions: day.solution.filter((s) => s.part === part),
  }));
}

function isReady(day: AdminDay) {
  return (
    isFilledIn(day) && songsOf(day).every((song) => song.solutions.length > 0)
  );
}

function DayCard({ day, hasSong }: { day: AdminDay; hasSong: boolean }) {
  const filledIn = isFilledIn(day);
  const songs = songsOf(day);
  const missingAnswers = songs.some((song) => song.solutions.length === 0);
  const players = new Set(day.answers.map((a) => a.userId)).size;
  const hints = [
    { text: day.hint1, file: day.hasFileHint1 },
    { text: day.hint2, file: day.hasFileHint2 },
    { text: day.hint3, file: day.hasFileHint3 },
  ];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-start gap-3 border-b border-gray-100 p-4">
        <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-white">
          <span className="text-xl leading-none font-bold">
            {format(day.date, "d")}
          </span>
          <span className="text-[0.65rem] uppercase">
            {format(day.date, "MMM", { locale: nb })}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          {filledIn ? (
            songs.map(({ part, artist, song }) => (
              <div key={part} className={part > 1 ? "mt-2" : undefined}>
                <p className="font-bold break-words">{artist}</p>
                <p className="break-words text-gray-700">{song}</p>
              </div>
            ))
          ) : (
            <p className="font-bold text-gray-400 italic">Ikke fylt ut</p>
          )}
        </div>
        <NextLink
          href={`/edit/${day.id}`}
          className="shrink-0 rounded-md border border-gray-300 px-3 py-1 text-sm font-semibold hover:border-primary hover:text-primary"
        >
          Rediger
        </NextLink>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 text-sm">
        <div className="flex flex-wrap gap-1.5">
          <Badge tone={hasSong ? "good" : "bad"}>
            {hasSong ? "Lydfil" : "Mangler lydfil"}
          </Badge>
          <Badge tone={missingAnswers ? "bad" : "good"}>
            {missingAnswers ? "Mangler svar" : `${day.solution.length} svar`}
          </Badge>
          {day.dualAnswer ? <Badge tone="neutral">Dobbeltsvar</Badge> : null}
          {day.hasTextSolution ? (
            <Badge tone="neutral">Tekstoppgave</Badge>
          ) : null}
          {day.difficulty ? (
            <Badge tone="neutral">Vanskelighet {day.difficulty}/3</Badge>
          ) : null}
          <Badge tone="neutral">
            {players} {players === 1 ? "løser" : "løsere"}
          </Badge>
        </div>

        <Field label="Beskrivelse">
          {day.description ? (
            <p className="line-clamp-3 whitespace-pre-line">
              {day.description}
            </p>
          ) : (
            <Missing />
          )}
        </Field>

        {songs.map(({ part, solutions }) => (
          <Field
            key={part}
            label={
              day.dualAnswer ? `Godkjente svar, sang ${part}` : "Godkjente svar"
            }
          >
            {solutions.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {solutions.map((s) => (
                  <li
                    key={s.id}
                    className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs"
                  >
                    {s.solution}
                  </li>
                ))}
              </ul>
            ) : (
              <Missing />
            )}
          </Field>
        ))}

        <Field label="Hint">
          <ol className="space-y-1">
            {hints.map((hint, index) => (
              <li key={index} className="flex gap-2">
                <span className="w-4 shrink-0 font-bold text-gray-500">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  {hint.file ? (
                    <Badge tone="neutral">Lydfil</Badge>
                  ) : hint.text ? (
                    <span className="break-words whitespace-pre-line">
                      {hint.text}
                    </span>
                  ) : (
                    <Missing />
                  )}
                </span>
              </li>
            ))}
          </ol>
        </Field>

        {day.solutionDescription ? (
          <Field label="Fasitbeskrivelse">
            <p className="line-clamp-3 whitespace-pre-line">
              {day.solutionDescription}
            </p>
          </Field>
        ) : null}

        <dl className="mt-auto grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-gray-100 pt-3 text-gray-600">
          <dt>Laget av</dt>
          <dd className="truncate text-ink">{day.madeBy || <Missing />}</dd>
          {day.video ? (
            <>
              <dt>Video</dt>
              <dd className="truncate">
                <ExternalLink href={day.video} />
              </dd>
            </>
          ) : null}
          {day.solutionVideo ? (
            <>
              <dt>Fasitvideo</dt>
              <dd className="truncate">
                <ExternalLink href={day.solutionVideo} />
              </dd>
            </>
          ) : null}
        </dl>
      </div>
    </article>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function Missing() {
  return <span className="text-gray-400 italic">Ikke satt</span>;
}

function ExternalLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary underline-offset-2 hover:underline"
    >
      {href.replace(/^https?:\/\/(www\.)?/, "")}
    </a>
  );
}

const badgeTones = {
  good: "bg-green-50 text-green-800 ring-green-200",
  bad: "bg-red-50 text-red-800 ring-red-200",
  neutral: "bg-gray-50 text-gray-700 ring-gray-200",
};

function Badge({
  tone,
  className,
  children,
}: {
  tone: keyof typeof badgeTones;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
