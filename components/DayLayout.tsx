import React from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import { format, parseISO } from "date-fns";
import Layout from "./Layout";
import { AdminEditLink } from "./AdminEditLink";
import { Thumbnail } from "./Thumbnail";
import { Audio } from "./lib/Audio";
import { YoutubeVideo } from "./lib/YoutubeVideo";
import { Heading, cn } from "./ui";

/** Page frame for a day: navigation, the date heading and a centred column. */
export function DayShell({
  id,
  date,
  madeBy,
  children,
}: {
  id: number;
  date: string;
  madeBy?: string;
  children: React.ReactNode;
}) {
  return (
    <Layout whiteBg>
      <nav className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold text-gray-700 hover:bg-gray-100 hover:text-primary"
        >
          <span aria-hidden>←</span> Tilbake
        </Link>
        <AdminEditLink id={id} />
      </nav>

      <div className="mx-auto mt-4 max-w-3xl space-y-6">
        <header className="flex flex-col items-center gap-3 text-center">
          {madeBy ? <Thumbnail image={madeBy} size={88} /> : null}
          <div>
            <p className="text-sm font-semibold tracking-wider text-primary uppercase">
              Luke {format(parseISO(date), "d")}
            </p>
            <Heading as="h1">{format(parseISO(date), "d. 'desember'")}</Heading>
          </div>
        </header>

        {children}
      </div>
    </Layout>
  );
}

/** The song (or video) and the task description. */
export function DayTask({
  id,
  video,
  hasTextSolution,
  description,
}: {
  id: number;
  video?: string;
  hasTextSolution?: boolean;
  description?: string;
}) {
  return (
    <section className="space-y-5">
      {video ? (
        <div className="overflow-hidden rounded-xl">
          <YoutubeVideo link={video} />
        </div>
      ) : hasTextSolution ? null : (
        <Audio
          controls
          preload="none"
          src={`/api/song/${id}`}
          className="max-w-none"
        >
          Nettleseren din støtter ikke lydavspilling.
        </Audio>
      )}
      {description ? (
        <div className="space-y-3 text-lg leading-relaxed [&_a]:text-primary [&_a]:underline [&_ol]:list-decimal [&_ol]:ps-6 [&_ul]:list-disc [&_ul]:ps-6">
          <Markdown>{description}</Markdown>
        </div>
      ) : null}
    </section>
  );
}

export function Card({
  title,
  aside,
  tone = "default",
  className,
  children,
}: {
  title?: React.ReactNode;
  aside?: React.ReactNode;
  tone?: "default" | "success";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border p-5 shadow-sm sm:p-6",
        tone === "success"
          ? "border-green-200 bg-green-50/60"
          : "border-gray-200 bg-white",
        className
      )}
    >
      {title || aside ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {title ? <Heading size="md">{title}</Heading> : <span />}
          {aside}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Pill({
  tone = "primary",
  children,
}: {
  tone?: "primary" | "success" | "muted";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold",
        tone === "primary" && "bg-primary text-white",
        tone === "success" && "bg-green-600 text-white",
        tone === "muted" && "bg-gray-100 text-gray-700"
      )}
    >
      {children}
    </span>
  );
}

/** One hint row: a numbered badge followed by its content. */
export function HintRow({
  number,
  locked,
  children,
}: {
  number: number;
  locked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold",
          locked ? "bg-gray-100 text-gray-400" : "bg-primary text-white"
        )}
      >
        {number}
      </span>
      <div className="min-w-0 flex-1 space-y-2 pt-0.5">
        <span className="sr-only">Hint {number}: </span>
        {children}
      </div>
    </li>
  );
}

export function HintAudio({ id, number }: { id: number; number: number }) {
  return (
    <Audio
      controls
      preload="none"
      src={`/api/hint/${id}/${number}`}
      className="mx-0 max-w-md"
    >
      Nettleseren din støtter ikke lydavspilling.
    </Audio>
  );
}

/** The answer key: one line per song. */
export function SongList({
  songs,
  numbered,
}: {
  songs: { part: number; artist?: string; song?: string }[];
  numbered: boolean;
}) {
  return (
    <ul className="space-y-1">
      {songs.map(({ part, artist, song }) => (
        <li key={part} className="text-xl font-bold">
          {numbered ? (
            <span className="me-2 text-base font-semibold text-gray-500">
              Sang {part}
            </span>
          ) : null}
          {artist} – {song}
        </li>
      ))}
    </ul>
  );
}

/** Gives the shared stats and solver boxes the same look as the day's cards. */
export const dayBoxClasses =
  "rounded-xl border border-gray-200 p-5 shadow-sm sm:p-6";

/** Statistics and the solver list, side by side on wide screens. */
export function DayFooter({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}
