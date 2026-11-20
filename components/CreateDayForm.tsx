"use client";

import React, { useState } from "react";
import Layout from "../components/Layout";

import { DayProps } from "../components/Day";
import {
  Button,
  Checkbox,
  ConfirmDialog,
  DeleteIcon,
  Heading,
  Input,
  Label,
  buttonClasses,
  cn,
} from "./ui";
import { Control, Controller, useFieldArray, useForm } from "react-hook-form";
import { YoutubeVideo } from "./lib/YoutubeVideo";
import { UiFileInputButton } from "./lib/UiFileUploadButton";
import { format, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";

import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  BlockTypeSelect,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";

interface CreateDayFormProps extends DayProps {
  onSubmit: (data: FormData) => Promise<void>;
  submitButtonText?: string;
  deleteAction?: () => Promise<void>;
}

export type FormData = {
  description: string;
  date: Date;
  hasTextSolution: boolean;
  song: string;
  artist: string;
  solutions: { id?: string; value: string }[];
  /** Dual-answer days: the second song and its accepted answers. */
  dualAnswer: boolean;
  artist2: string;
  song2: string;
  solutions2: { id?: string; value: string }[];
  madeBy: string;
  video: string;
  file: string;
  solutionVideo: string;
  solutionDescription: string;
  hint1: string;
  hint1file: string;
  hint2: string;
  hint2file: string;
  hint3: string;
  hint3file: string;
};

/** The JSON body the day API expects. */
export function toDayPayload(data: FormData, openingHour: number) {
  const { solutions, solutions2, date, ...rest } = data;
  date.setHours(openingHour);
  return {
    ...rest,
    artist2: data.dualAnswer ? data.artist2 : null,
    song2: data.dualAnswer ? data.song2 : null,
    solutions: solutions.map((el) => el.value),
    solutions2: data.dualAnswer ? (solutions2 ?? []).map((el) => el.value) : [],
    date,
  };
}

const madeByOptions: [string, string][] = [
  ["Stein", "Stein"],
  ["Tobias", "Tobias"],
  ["Skoyerfanden", "Skøyerfanden"],
  ["Bjarte", "Bjarte"],
  ["Tomas", "Tomas"],
  ["Kim", "Kim"],
  ["Matt", "Matt"],
  ["Rune", "Rune"],
  ["Annen", "Annen"],
  ["TobiasStein", "Tobias og Stein"],
  ["TobiasSindre", "Tobias og Sindre"],
  ["Arild", "Arild"],
];

const primaryButton =
  "bg-primary text-white hover:bg-[#741111] active:bg-[#5c0d0d] disabled:hover:bg-primary";

export const CreateDayForm: React.FC<CreateDayFormProps> = (props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const isEdit = !!props.deleteAction;

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { isDirty, isValid, errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      description: props.description,
      artist: props.artist,
      hasTextSolution: props.hasTextSolution ?? false,
      date: parseISO(props.date),
      madeBy: props.madeBy,
      song: props.song,
      video: props.video,
      solutions: props.solution
        ?.filter((el) => (el.part ?? 1) === 1)
        .map((el) => ({ value: el.solution })),
      dualAnswer: props.dualAnswer ?? false,
      artist2: props.artist2 ?? "",
      song2: props.song2 ?? "",
      solutions2: props.solution
        ?.filter((el) => el.part === 2)
        .map((el) => ({ value: el.solution })),
      solutionVideo: props.solutionVideo,
      solutionDescription: props.solutionDescription,
      file: props.file?.file,
      hint1: props.hint1,
      hint2: props.hint2,
      hint3: props.hint3,
      hint1file: props.file?.hint1file,
      hint2file: props.file?.hint2file,
      hint3file: props.file?.hint3file,
    },
  });

  const date = watch("date");
  const video = watch("video");
  const songFile = watch("file");
  const dual = watch("dualAnswer");
  const canSave = isDirty && isValid && !isSubmitting;
  const submitText = props.submitButtonText ?? "Opprett luke";

  return (
    <Layout whiteBg>
      <form onSubmit={handleSubmit(props.onSubmit)} className="space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href="/admin"
              className="text-sm text-gray-600 hover:text-primary hover:underline"
            >
              ← Til oversikt
            </Link>
            <Heading size="lg" className="mt-1">
              {isEdit ? "Rediger luke" : "Ny luke"}
              {date ? (
                <span className="text-gray-500">
                  {" "}
                  · {format(date, "d. MMMM", { locale: nb })}
                </span>
              ) : null}
            </Heading>
          </div>
          {isEdit ? (
            <Button
              variant="danger"
              className="h-9 text-sm"
              onClick={() => setIsDeleteOpen(true)}
            >
              <DeleteIcon />
              Slett luke
            </Button>
          ) : null}
        </header>

        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={() => props.deleteAction?.()}
          title="Slett luke"
          cancelText="Avbryt"
          confirmText="Slett"
        >
          Er du sikker? Luken, svarene og statistikken for den slettes.
        </ConfirmDialog>

        <Section title="Grunninfo">
          <div className="grid gap-5 md:grid-cols-[auto_1fr]">
            <div>
              <Label htmlFor="date-input">Dato</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Input
                    id="date-input"
                    name="date-input"
                    type="date"
                    className="w-auto"
                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const [year, month, day] = e.target.value
                        .split("-")
                        .map(Number);
                      field.onChange(new Date(year, month - 1, day));
                    }}
                  />
                )}
              />
            </div>

            <div className="flex items-end md:pb-2">
              <Controller
                name="hasTextSolution"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    Tekstoppgave{" "}
                    <span className="text-sm text-gray-500">
                      (ingen sang, svaret er tekst)
                    </span>
                  </Checkbox>
                )}
              />
            </div>
          </div>

          <Controller
            name="dualAnswer"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              >
                Dobbeltsvar{" "}
                <span className="text-sm text-gray-500">
                  (to sanger å finne, hver gir poeng for seg)
                </span>
              </Checkbox>
            )}
          />

          <div>
            <p className="mb-2 text-base font-medium" id="made-by-label">
              Laget av
            </p>
            <Controller
              name="madeBy"
              control={control}
              render={({ field }) => (
                <div
                  role="radiogroup"
                  aria-labelledby="made-by-label"
                  className="flex flex-wrap gap-2"
                >
                  {madeByOptions.map(([value, label]) => {
                    const checked = field.value === value;
                    return (
                      <label
                        key={value}
                        className={cn(
                          "cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors",
                          "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#4299e1]/60",
                          checked
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 hover:border-primary"
                        )}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          name={field.name}
                          value={value}
                          checked={checked}
                          onChange={() => field.onChange(value)}
                          onBlur={field.onBlur}
                        />
                        {label}
                      </label>
                    );
                  })}
                </div>
              )}
            />
          </div>
        </Section>

        <Section
          title="Oppgave"
          description="Det spillerne ser når luken åpner."
        >
          <div>
            <Label htmlFor="description">Beskrivelse</Label>
            <div className="overflow-hidden rounded-md border border-[#e2e8f0] focus-within:border-[#3182ce]">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <MDXEditor
                    markdown={field.value ?? ""}
                    onChange={field.onChange}
                    contentEditableClassName="min-h-32"
                    plugins={[
                      headingsPlugin(),
                      listsPlugin(),
                      quotePlugin(),
                      thematicBreakPlugin(),
                      toolbarPlugin({
                        toolbarContents: () => (
                          <>
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                            <BlockTypeSelect />
                          </>
                        ),
                      }),
                    ]}
                  />
                )}
              />
            </div>
          </div>

          <AudioField
            label="Sang"
            control={control}
            name="file"
            buttonLabel={songFile || isEdit ? "Bytt lydfil" : "Last opp lydfil"}
            previewSrc={
              songFile
                ? songFile
                : isEdit
                  ? `/api/admin/file/${props.id}`
                  : null
            }
          />

          <div>
            <Label htmlFor="video">
              Oppgavevideo{" "}
              <span className="text-sm font-normal text-gray-500">
                (valgfri, YouTube-ID)
              </span>
            </Label>
            <Input
              id="video"
              {...register("video")}
              placeholder="f.eks. dQw4w9WgXcQ"
              type="text"
            />
            {video ? (
              <div className="mt-3 max-w-xl overflow-hidden rounded-md">
                <YoutubeVideo link={video} />
              </div>
            ) : null}
          </div>
        </Section>

        <Section
          title="Fasit"
          description={
            dual
              ? "Spillerne gjetter i ett felt. Hvert svar sjekkes mot begge sangene."
              : undefined
          }
        >
          <SongFields
            title={dual ? "Sang 1" : undefined}
            control={control}
            artist={
              <TextField
                id="artist"
                label="Artist"
                required
                error={errors.artist ? "Artist må fylles ut" : undefined}
                {...register("artist", { required: true })}
              />
            }
            song={
              <TextField
                id="song"
                label="Sang"
                required
                error={errors.song ? "Sang må fylles ut" : undefined}
                {...register("song", { required: true })}
              />
            }
            solutionsName="solutions"
          />

          {dual ? (
            <SongFields
              title="Sang 2"
              control={control}
              artist={
                <TextField
                  id="artist2"
                  label="Artist"
                  required
                  error={errors.artist2 ? "Artist må fylles ut" : undefined}
                  {...register("artist2", {
                    validate: (value, values) =>
                      !values.dualAnswer || !!value?.trim(),
                  })}
                />
              }
              song={
                <TextField
                  id="song2"
                  label="Sang"
                  required
                  error={errors.song2 ? "Sang må fylles ut" : undefined}
                  {...register("song2", {
                    validate: (value, values) =>
                      !values.dualAnswer || !!value?.trim(),
                  })}
                />
              }
              solutionsName="solutions2"
            />
          ) : null}

          <TextField
            id="solutionDescription"
            label="Løsningstekst"
            hint="Vises sammen med fasiten."
            {...register("solutionDescription")}
          />
        </Section>

        <Section
          title="Hint"
          description="Hint 1, 2 og 3 åpner kl. 10, 11 og 12. Bruk tekst, lydfil eller begge."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {([1, 2, 3] as const).map((n) => {
              const fileName = `hint${n}file` as const;
              const uploaded = watch(fileName);
              const hasExisting = isEdit && !!props[`hasFileHint${n}`];
              return (
                <div
                  key={n}
                  className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/60 p-4"
                >
                  <p className="font-bold">
                    Hint {n}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      kl. {9 + n}:00
                    </span>
                  </p>
                  <TextField
                    id={`hint${n}`}
                    label="Tekst"
                    {...register(`hint${n}`)}
                  />
                  <AudioField
                    label="Lydfil"
                    control={control}
                    name={fileName}
                    buttonLabel={
                      uploaded || hasExisting ? "Bytt lydfil" : "Last opp"
                    }
                    previewSrc={
                      uploaded
                        ? uploaded
                        : hasExisting
                          ? `/api/admin/${props.id}/${n}`
                          : null
                    }
                  />
                </div>
              );
            })}
          </div>
        </Section>

        <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
          {!isDirty ? (
            <span className="mr-auto text-sm text-gray-500">
              Ingen endringer
            </span>
          ) : !isValid ? (
            <span className="mr-auto text-sm text-[#c53030]">
              Fyll ut artist og sang{dual ? " for begge sangene" : ""}
            </span>
          ) : null}
          <Link href="/admin" className={buttonClasses("default")}>
            Avbryt
          </Link>
          <button
            type="submit"
            disabled={!canSave}
            className={buttonClasses("default", primaryButton)}
          >
            {isSubmitting ? "Lagrer …" : submitText}
          </button>
        </div>
      </form>
    </Layout>
  );
};

function SongFields({
  title,
  control,
  artist,
  song,
  solutionsName,
}: {
  title?: string;
  control: Control<FormData>;
  artist: React.ReactNode;
  song: React.ReactNode;
  solutionsName: "solutions" | "solutions2";
}) {
  const content = (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        {artist}
        {song}
      </div>
      <SolutionsField control={control} name={solutionsName} />
    </>
  );

  if (!title) return <div className="space-y-5">{content}</div>;

  return (
    <div className="space-y-5 rounded-lg border border-gray-200 bg-gray-50/60 p-4">
      <p className="font-bold">{title}</p>
      {content}
    </div>
  );
}

function SolutionsField({
  control,
  name,
}: {
  control: Control<FormData>;
  name: "solutions" | "solutions2";
}) {
  const [solution, setSolution] = useState("");
  const { fields, append, remove } = useFieldArray({ control, name });
  const inputId = `${name}-input`;

  function addSolution() {
    const value = solution.trim();
    if (!value) return;
    append({ value });
    setSolution("");
  }

  return (
    <div>
      <Label htmlFor={inputId}>Godkjente svar</Label>
      <p className="-mt-1 mb-2 text-sm text-gray-500">
        Spillerens svar må være likt ett av disse (store og små bokstaver
        spiller ingen rolle).
      </p>
      <div className="flex gap-2">
        <Input
          id={inputId}
          value={solution}
          placeholder="Skriv et svar og trykk Enter"
          type="text"
          onChange={(e) => setSolution(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSolution();
            }
          }}
        />
        <Button onClick={addSolution} disabled={!solution.trim()}>
          Legg til
        </Button>
      </div>

      {fields.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {fields.map((field, index) => (
            <li
              key={field.id}
              className="flex items-center gap-1 rounded-full bg-white py-1 pr-1 pl-3 font-mono text-sm ring-1 ring-gray-200"
            >
              {field.value}
              <button
                type="button"
                aria-label={`Fjern svaret ${field.value}`}
                className="flex size-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-[#e53e3e]"
                onClick={() => remove(index)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-[#c53030]">
          Ingen godkjente svar ennå. Uten svar kan ingen finne denne sangen.
        </p>
      )}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <Heading size="md">{title}</Heading>
      {description ? (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      ) : null}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
};

function TextField({
  id,
  label,
  hint,
  error,
  required,
  ...rest
}: TextFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-[#c53030]"> *</span> : null}
      </Label>
      <Input
        id={id}
        type="text"
        aria-invalid={!!error}
        className={cn(error && "border-[#e53e3e]")}
        {...rest}
      />
      {error ? (
        <p className="mt-1 text-sm text-[#c53030]">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}

function AudioField({
  label,
  control,
  name,
  buttonLabel,
  previewSrc,
}: {
  label: string;
  control: Control<FormData>;
  name: "file" | "hint1file" | "hint2file" | "hint3file";
  buttonLabel: string;
  previewSrc: string | null;
}) {
  return (
    <div>
      <p className="mb-2 text-base font-medium">{label}</p>
      <div className="space-y-3">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <UiFileInputButton
              label={buttonLabel}
              uploadFileName="theFiles"
              acceptedFileTypes="audio/*"
              onChange={field.onChange}
            />
          )}
        />
        {previewSrc ? (
          <audio controls preload="none" src={previewSrc} className="w-full">
            Nettleseren din støtter ikke lydavspilling.
          </audio>
        ) : (
          <p className="text-sm text-gray-500 italic">Ingen lydfil</p>
        )}
      </div>
    </div>
  );
}
