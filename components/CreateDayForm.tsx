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
} from "@chakra-ui/react";
import styled from "styled-components";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Spacer } from "../components/lib/Spacer";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { DeleteIcon } from "@chakra-ui/icons";

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
}

export type FormData = {
  description: string;
  date: Date;
  song: string;
  artist: string;
  solutions: { id: string; value: string }[];
  madeBy: string;
  video: string;
};

export const CreateDayForm: React.FC<CreateDayFormProps> = (props) => {
  const [solution, setSolution] = useState("");

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
    },
  });

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "solutions", // unique name for your Field Array
  });

  return (
    <Layout>
      <div>
        <form onSubmit={handleSubmit(props.onSubmit)}>
          <Spacer />
          <Heading size="lg">Endre luke</Heading>
          <Spacer />

          <FormControl>
            <FormLabel htmlFor="description">Beskrivelse</FormLabel>
            <Input
              name="description"
              autoFocus
              {...register("description", { required: true })}
              placeholder="Description"
              type="text"
            />
          </FormControl>

          <Spacer multiply={0.5} />

          <Controller
            name="madeBy"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field}>
                <Stack direction="row">
                  <Radio value="stein">Stein</Radio>
                  <Radio value="tobias">Tobias</Radio>
                  <Radio value="skoyerfanden">Skøyerfanden</Radio>
                  <Radio value="bjarte">Bjarte</Radio>
                  <Radio value="tomas">Tomas</Radio>
                  <Radio value="Kim">Kim</Radio>
                  <Radio value="Matt">Matt</Radio>
                  <Radio value="Annen">Annen</Radio>
                </Stack>
              </RadioGroup>
            )}
          />

          <Spacer multiply={0.5} />

          <FormControl>
            <FormLabel htmlFor="artist">Artist</FormLabel>
            <Input
              name="artist"
              autoFocus
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
              autoFocus
              {...register("song", { required: true })}
              placeholder="Sang"
              type="text"
            />
          </FormControl>

          <Spacer multiply={0.5} />

          <FormControl>
            <FormLabel htmlFor="video">Video</FormLabel>
            <Input
              name="video"
              autoFocus
              {...register("video")}
              placeholder="Video"
              type="text"
            />
          </FormControl>

          <Spacer multiply={0.5} />

          {/* <Video link={watch("video")} /> */}

          <Spacer multiply={0.5} />

          <FormControl>
            <FormLabel htmlFor="madeBy">Laget av</FormLabel>
            <Input
              name="madeBy"
              autoFocus
              {...register("madeBy")}
              placeholder="Laget av"
              type="text"
            />
          </FormControl>

          <Spacer multiply={0.5} />

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
            <FormLabel htmlFor="singlesolution">Legg til løsning</FormLabel>
            <Flex>
              <Input
                id="singlesolution"
                autoFocus
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

          <StyledSubmit
            disabled={!isDirty || !isValid} // here
            type="submit"
            value="Opprett rute"
          />
          <StyledBack href="#" onClick={() => Router.push("/")}>
            eller avbryt
          </StyledBack>
        </form>
      </div>
    </Layout>
  );
};
