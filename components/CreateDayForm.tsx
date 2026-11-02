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
  Radio,
} from "./ui";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Spacer } from "../components/lib/Spacer";
import { YoutubeVideo } from "./lib/YoutubeVideo";
import { UiFileInputButton } from "./lib/UiFileUploadButton";
import { format, parseISO } from "date-fns";
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

export const CreateDayForm: React.FC<CreateDayFormProps> = (props) => {
  const [solution, setSolution] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { isDirty, isValid },
  } = useForm<FormData>({
    defaultValues: {
      description: props.description,
      artist: props.artist,
      hasTextSolution: props.hasTextSolution ?? false,
      date: parseISO(props.date),
      madeBy: props.madeBy,
      song: props.song,
      video: props.video,
      solutions: props.solution?.map((el) => ({ value: el.solution })),
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

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "solutions", // unique name for your Field Array
  });

  return (
    <Layout whiteBg>
      <Link href="/admin" className="hover:underline">
        Til oversikt
      </Link>
      <Spacer />
      <div>
        <form onSubmit={handleSubmit(props.onSubmit)}>
          <Spacer />
          <Button
            disabled={!isDirty || !isValid} // here
            type="submit"
          >
            {props.submitButtonText ? props.submitButtonText : "Opprett rute"}
          </Button>

          <Spacer />
          <div className="flex justify-between">
            <Heading size="lg">Luke</Heading>
            <div>
              {props.deleteAction ? (
                <Button
                  aria-label="Slett dag"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <DeleteIcon />
                </Button>
              ) : null}
            </div>
          </div>

          <ConfirmDialog
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={() => props.deleteAction?.()}
            title="Slett dag"
            cancelText="Avbryt"
            confirmText="Slett"
          >
            Er du sikker?
          </ConfirmDialog>

          <Spacer />

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

          <Spacer multiply={0.5} />

          <div>
            <Label htmlFor="description">Beskrivelse</Label>

            <Controller
              name="description"
              control={control}
              render={({ field }) => {
                return (
                  <MDXEditor
                    markdown={field.value ?? ""}
                    onChange={field.onChange}
                    plugins={[
                      headingsPlugin(),
                      listsPlugin(),
                      quotePlugin(),
                      thematicBreakPlugin(),
                      toolbarPlugin({
                        toolbarClassName: "my-classname",
                        toolbarContents: () => (
                          <>
                            {" "}
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                            <BlockTypeSelect />
                          </>
                        ),
                      }),
                    ]}
                  />
                );
              }}
            />
          </div>

          <Spacer multiply={0.5} />

          <Controller
            name="madeBy"
            control={control}
            render={({ field }) => (
              <div
                role="radiogroup"
                aria-label="Laget av"
                className="flex flex-col gap-2 lg:flex-row lg:flex-wrap"
              >
                {madeByOptions.map(([value, label]) => (
                  <Radio
                    key={value}
                    name={field.name}
                    value={value}
                    checked={field.value === value}
                    onChange={() => field.onChange(value)}
                    onBlur={field.onBlur}
                  >
                    {label}
                  </Radio>
                ))}
              </div>
            )}
          />

          <Spacer multiply={0.5} />

          <div>
            <Controller
              name="file"
              control={control}
              render={({ field }) => (
                <UiFileInputButton
                  label="Klikk her for å laste opp sang"
                  uploadFileName="theFiles"
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <Spacer />
          <div>
            <Controller
              name="hasTextSolution"
              control={control}
              render={({ field }) => {
                return (
                  <Checkbox
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    Tekstoppgave
                  </Checkbox>
                );
              }}
            ></Controller>
          </div>

          <Spacer multiply={0.5} />

          <audio
            controls
            preload="none"
            src={watch("file") ? watch("file") : `/api/admin/file/${props.id}`}
          >
            Your browser does not support the
            <code>audio</code> element.
          </audio>

          <Spacer multiply={0.5} />

          <div>
            <Label htmlFor="video">Valgfri oppgavevideo</Label>
            <Input
              id="video"
              name="video"
              {...register("video")}
              placeholder="Video"
              type="text"
            />
          </div>

          <Spacer multiply={0.5} />

          <YoutubeVideo link={watch("video")} />

          <Spacer multiply={0.5} />

          <div>
            <Label htmlFor="artist">Artist</Label>
            <Input
              id="artist"
              name="artist"
              {...register("artist", { required: true })}
              placeholder="Artist"
              type="text"
            />
          </div>

          <Spacer multiply={0.5} />

          <div>
            <Label htmlFor="song">Sang</Label>
            <Input
              id="song"
              name="song"
              {...register("song", { required: true })}
              placeholder="Sang"
              type="text"
            />
          </div>

          <Spacer multiply={0.5} />

          <div>
            <Label htmlFor="solutionDescription">Løsningstekst</Label>
            <Input
              id="solutionDescription"
              name="solutionDescription"
              {...register("solutionDescription", { required: false })}
              placeholder="Løsningstekst"
              type="text"
            />
          </div>

          <Spacer multiply={0.5} />

          <div>
            <Label htmlFor="hint1">Hint 1</Label>
            <Input
              id="hint1"
              name="hint1"
              {...register("hint1")}
              placeholder="Hint1"
              type="text"
            />
          </div>

          <Spacer multiply={0.5} />

          <div>
            <Controller
              name="hint1file"
              control={control}
              render={({ field }) => (
                <UiFileInputButton
                  label="Klikk her for å laste opp hint 1"
                  uploadFileName="theFiles"
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <Spacer multiply={0.5} />

          <audio
            controls
            preload="none"
            src={
              watch("hint1file")
                ? watch("hint1file")
                : `/api/admin/${props.id}/1`
            }
          >
            Your browser does not support the
            <code>audio</code> element.
          </audio>

          <Spacer multiply={0.5} />

          <div>
            <Label htmlFor="hint2">Hint 2</Label>
            <Input
              id="hint2"
              name="hint2"
              {...register("hint2")}
              placeholder="Hint2"
              type="text"
            />
          </div>

          <Spacer multiply={0.5} />

          <div>
            <Controller
              name="hint2file"
              control={control}
              render={({ field }) => (
                <UiFileInputButton
                  label="Klikk her for å laste opp hint 2"
                  uploadFileName="theFiles"
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <Spacer multiply={0.5} />

          <audio
            controls
            preload="none"
            src={
              watch("hint2file")
                ? watch("hint2file")
                : `/api/admin/${props.id}/2`
            }
          >
            Your browser does not support the
            <code>audio</code> element.
          </audio>

          <Spacer multiply={0.5} />

          <div>
            <Label htmlFor="hint3">Hint 3</Label>
            <Input
              id="hint3"
              name="hint3"
              {...register("hint3")}
              placeholder="Hint3"
              type="text"
            />
          </div>

          <Spacer multiply={0.5} />

          <audio
            controls
            preload="none"
            src={
              watch("hint3file")
                ? watch("hint3file")
                : `/api/admin/${props.id}/3`
            }
          >
            Your browser does not support the
            <code>audio</code> element.
          </audio>

          <Spacer multiply={0.5} />

          <div>
            <Controller
              name="hint3file"
              control={control}
              render={({ field }) => (
                <UiFileInputButton
                  label="Klikk her for å laste opp hint 3"
                  uploadFileName="theFiles"
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <Spacer multiply={0.5} />

          <div>
            <Label htmlFor="singlesolution">Legg til løsning</Label>
            <div className="flex">
              <Input
                id="singlesolution"
                value={solution}
                placeholder="Løsning"
                type="text"
                onChange={(e) => setSolution(e.target.value)}
                className="mr-5"
              />
              <Button
                type="button"
                onClick={() => {
                  append({ value: solution });
                  setSolution("");
                }}
              >
                Legg til løsning
              </Button>
            </div>
          </div>

          <Spacer multiply={0.5} />

          {fields.map((field, index) => (
            <p
              key={field.id} // important to include key with field's id
            >
              <Button
                aria-label="Fjern løsning"
                className="mr-3 mb-3"
                onClick={() => remove(index)}
              >
                <DeleteIcon />
              </Button>
              {field.value}
            </p>
          ))}

          <Spacer />

          <Button
            disabled={!isDirty || !isValid} // here
            type="submit"
          >
            {props.submitButtonText ? props.submitButtonText : "Opprett rute"}
          </Button>
          <Link href="/admin" className="ml-4">
            eller avbryt
          </Link>
        </form>
      </div>
    </Layout>
  );
};
