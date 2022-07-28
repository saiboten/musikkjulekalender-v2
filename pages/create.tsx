import React, { useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import styled from "styled-components";
import { DeleteIcon } from "@chakra-ui/icons";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { Spacer } from "../components/lib/Spacer";
import { useSession } from "next-auth/react";

const StyledBack = styled.a`
  margin-left: 1rem;
`;

const StyledSubmit = styled.input`
  background: #ececec;
  border: 0;
  padding: 1rem 2rem;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 0.25rem;
  border: 0.125rem solid rgba(0, 0, 0, 0.2);
`;

type FormData = {
  description: string;
  date: Date;
  solutionArtist: string;
  solutionSong: string;
  solutions: { id: string; value: string }[];
};

// difficulty?: number;
//   points?: number;
//   image?: string;
//   solutionVideo?: string;

const Draft: React.FC = () => {
  const [solution, setSolution] = useState("");

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { isDirty, isValid },
  } = useForm<FormData>({
    defaultValues: {
      description: "TODO",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "solutions", // unique name for your Field Array
  });

  const onSubmit = async (data: FormData) => {
    const solutions = data.solutions.map((el) => el.value);
    const { description, date } = data;

    try {
      const body = { description, solutions, date };

      await fetch(`/api/day`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const session = useSession();

  if (session.data?.user.role !== "admin") {
    return null;
  }

  return (
    <Layout>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Spacer />
          <Heading size="lg">New Day</Heading>
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

          <FormControl>
            <FormLabel htmlFor="solutionArtist">Artist</FormLabel>
            <Input
              name="solutionArtist"
              autoFocus
              {...register("solutionArtist", { required: true })}
              placeholder="Artist"
              type="text"
            />
          </FormControl>

          <Spacer multiply={0.5} />
          <FormControl>
            <FormLabel htmlFor="solutionSong">Sang</FormLabel>
            <Input
              name="solutionSong"
              autoFocus
              {...register("solutionSong", { required: true })}
              placeholder="Sang"
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
              {field.value}
              <Button ml="3" onClick={() => remove(index)}>
                <DeleteIcon />
              </Button>
            </p>
          ))}

          <Spacer />

          <StyledSubmit
            disabled={!isDirty || !isValid} // here
            type="submit"
            value="Create"
          />
          <StyledBack href="#" onClick={() => Router.push("/")}>
            or Cancel
          </StyledBack>
        </form>
      </div>
    </Layout>
  );
};

export default Draft;
