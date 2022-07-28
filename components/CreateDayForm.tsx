import React, { useState } from "react";
import Layout from "../components/Layout";

import Router from "next/router";
import { DayProps } from "../components/Day";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  Box,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import styled from "styled-components";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Spacer } from "../components/lib/Spacer";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { DeleteIcon } from "@chakra-ui/icons";
import { YoutubeVideo } from "./lib/YoutubeVideo";
import { UiFileInputButton } from "./lib/UiFileUploadButton";

const StyledBack = styled.a`
  margin-left: 1rem;
`;

const StyledSubmit = styled.input`
  background: #ececec;
  border: 0;
  padding: 1rem 2rem;
`;

interface CreateDayFormProps extends DayProps {
  onSubmit: (data: FormData) => Promise<void>;
  submitButtonText?: string;
  deleteAction?: () => Promise<void>;
}

export type FormData = {
  description: string;
  date: Date;
  song: string;
  artist: string;
  solutions: { id: string; value: string }[];
  madeBy: string;
  video: string;
  file: string;
  solutionVideo: string;
  difficulty: string;
  hint1: string;
  hint2: string;
  hint3: string;
};

export const CreateDayForm: React.FC<CreateDayFormProps> = (props) => {
  const [solution, setSolution] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

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
      date: new Date(props.date),
      madeBy: props.madeBy, //TODO
      song: props.song,
      video: props.video,
      solutions: props.solution?.map((el) => ({ value: el.solution })),
      file: props.file?.file,
      difficulty: `${props.difficulty}`,
      hint1: props.hint1,
      hint2: props.hint2,
      hint3: props.hint3,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "solutions", // unique name for your Field Array
  });

  return (
    <Layout whiteBg>
      <div>
        <form onSubmit={handleSubmit(props.onSubmit)}>
          <Spacer />
          <Box display="flex" justifyContent="space-between">
            <Heading size="lg">Luke</Heading>
            <Box>
              {props.deleteAction ? (
                <Button onClick={onOpen}>
                  <DeleteIcon />
                </Button>
              ) : null}
            </Box>
          </Box>

          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Slett dag
                </AlertDialogHeader>

                <AlertDialogBody>Er du sikker?</AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Avbryt
                  </Button>
                  <Button colorScheme="red" onClick={props.deleteAction} ml={3}>
                    Slett
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>

          <Spacer />

          <FormControl>
            <FormLabel>Dato</FormLabel>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <SingleDatepicker
                  name="date-input"
                  date={field.value}
                  onDateChange={field.onChange}
                />
              )}
            ></Controller>
          </FormControl>

          <Spacer multiply={0.5} />

          <FormControl>
            <FormLabel htmlFor="description">Beskrivelse</FormLabel>
            <Textarea
              name="description"
              {...register("description", { required: true })}
              placeholder="Description"
            />
          </FormControl>

          <Spacer multiply={0.5} />

          <Controller
            name="madeBy"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field}>
                <Stack direction={{ base: "column", lg: "row" }}>
                  <Radio value="Stein">Stein</Radio>
                  <Radio value="Tobias">Tobias</Radio>
                  <Radio value="Skoyerfanden">Skøyerfanden</Radio>
                  <Radio value="Bjarte">Bjarte</Radio>
                  <Radio value="Tomas">Tomas</Radio>
                  <Radio value="Kim">Kim</Radio>
                  <Radio value="Matt">Matt</Radio>
                  <Radio value="Annen">Annen</Radio>
                </Stack>
              </RadioGroup>
            )}
          />

          <Spacer multiply={0.5} />

          <FormControl>
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
          </FormControl>

          <Spacer multiply={0.5} />

          <audio controls src={watch("file")}>
            Your browser does not support the
            <code>audio</code> element.
          </audio>

          <Spacer multiply={0.5} />

          <FormControl>
            <FormLabel htmlFor="video">Valgfri oppgavevideo</FormLabel>
            <Input
              name="video"
              {...register("video")}
              placeholder="Video"
              type="text"
            />
          </FormControl>

          <Spacer multiply={0.5} />

          <YoutubeVideo link={watch("video")} />

          <Spacer multiply={0.5} />

          <FormControl>
            <FormLabel htmlFor="artist">Artist</FormLabel>
            <Input
              name="artist"
              {...register("artist", { required: true })}
              placeholder="Artist"
              type="text"
            />
          </FormControl>

          <Spacer multiply={0.5} />

          <FormControl>
            <FormLabel htmlFor="song">Sang</FormLabel>
            <Input
              name="song"
              {...register("song", { required: true })}
              placeholder="Sang"
              type="text"
            />
          </FormControl>

          <Spacer multiply={0.5} />

          <FormControl>
            <FormLabel htmlFor="hint1">Hint 1</FormLabel>
            <Input
              name="hint1"
              {...register("hint1")}
              placeholder="Hint1"
              type="text"
            />
          </FormControl>

          <Spacer multiply={0.5} />

          <FormControl>
            <FormLabel htmlFor="hint2">Hint 2</FormLabel>
            <Input
              name="hint2"
              {...register("hint2")}
              placeholder="Hint2"
              type="text"
            />
          </FormControl>

          <Spacer multiply={0.5} />

          <FormControl>
            <FormLabel htmlFor="hint3">Hint 3</FormLabel>
            <Input
              name="hint3"
              {...register("hint3")}
              placeholder="Hint3"
              type="text"
            />
          </FormControl>

          <Spacer multiply={0.5} />

          <Controller
            name="difficulty"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field}>
                <Stack direction={{ base: "column", lg: "row" }}>
                  <Radio value="1">Enkel</Radio>
                  <Radio value="2">Medium</Radio>
                  <Radio value="3">Vanskelig</Radio>
                </Stack>
              </RadioGroup>
            )}
          />

          <Spacer multiply={0.5} />

          <FormControl>
            <FormLabel htmlFor="solutionVideo">Løsningsvideo</FormLabel>
            <Input
              name="solutionVideo"
              {...register("solutionVideo")}
              placeholder="Løsningsvideo"
              type="text"
            />
          </FormControl>

          <Spacer multiply={0.5} />

          <YoutubeVideo link={watch("solutionVideo")} />

          <Spacer multiply={0.5} />

          <FormControl>
            <FormLabel htmlFor="singlesolution">Legg til løsning</FormLabel>
            <Flex>
              <Input
                id="singlesolution"
                value={solution}
                placeholder="Løsning"
                type="text"
                onChange={(e) => setSolution(e.target.value)}
                mr="5"
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
            </Flex>
          </FormControl>

          <Spacer multiply={0.5} />

          {fields.map((field, index) => (
            <p
              key={field.id} // important to include key with field's id
            >
              <Button mr="3" mb="3" onClick={() => remove(index)}>
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
          <StyledBack href="#" onClick={() => Router.push("/")}>
            eller avbryt
          </StyledBack>
        </form>
      </div>
    </Layout>
  );
};
