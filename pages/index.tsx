import React from "react";
import type { GetServerSideProps } from "next";
import Image from "next/image";
import nisse from "../img/julenissetransparent.png";
import Layout from "../components/Layout";
import styled from "styled-components";
import Day, { DayProps } from "../components/Day";
import prisma from "../lib/prisma";
import { Grid, GridItem } from "../components/Grid";
import { getSession, useSession } from "next-auth/react";
import { Box, Heading } from "@chakra-ui/react";
import { Footer } from "../components/Footer";
import { HorisontalDraggable } from "../components/lib/HorisontalDraggable";
import { TopScores } from "../components/TopScores";
import { UserStats } from "../components/UserStats";
import { isBefore } from "date-fns";
import { BestDaily } from "../components/BestDaily";
import { Spacer } from "../components/lib/Spacer";

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1rem;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const now = new Date();
  now.setUTCHours(-2, 0, 0, 0);

  const todayDay = await prisma.day.findFirst({
    where: {
      date: now,
    },
  });

  const days = await prisma.day.findMany({
    orderBy: {
      date: "asc",
    },
    include: {
      answers: {
        where: {
          userId: session?.id ?? -1,
        },
      },
    },
  });

  const todayAnswers = (
    await prisma.answer.findMany({
      include: {
        user: true,
      },
      where: {
        points: {
          gt: 0,
        },
        dayId: todayDay.id,
      },
    })
  ).map((e) => {
    return {
      points: e.points,
      user: e.user.email,
    };
  });

  const userScores = days
    .filter((day) => isBefore(day.date, new Date()))
    .map((el) => {
      const score = el.answers.reduce((sum, next) => {
        return sum + next.points;
      }, 0);
      return {
        day: el.date.toISOString(),
        score,
      };
    });

  const users = await prisma.user.findMany({
    include: {
      answer: true,
    },
  });

  const scores = users.map((user) => {
    const points = user.answer.reduce((sum, next) => {
      return sum + next.points;
    }, 0);

    return {
      name: user.email?.split("@")[0] ?? "ukjent",
      score: points,
    };
  });

  const answers = await prisma.answer.findMany({
    where: {
      userId: session?.id,
    },
  });

  const points = answers.reduce((sum, next) => {
    return sum + next.points;
  }, 0);

  const daysWithFixedDates = days.map((el) => ({
    id: el.id,
    date: el.date.toString(),
  }));
  return {
    props: {
      days: daysWithFixedDates,
      points,
      scores,
      userScores,
      todayAnswers,
    },
  };
};

type Props = {
  days: DayProps[];
  points: number;
  scores?: { name: string; score: number }[];
  todayAnswers: { points: number; user: string }[];
  userScores: {
    day: string;
    score: number;
  }[];
};

const StyledHeader = styled.div`
  text-align: left;
  padding-top: 1rem;
  display: flex;
  flex-direction: row;

  @media screen and (max-width: 45rem) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    flex-direction: column;
  }
`;

const Blog: React.FC<Props> = (props) => {
  const session = useSession();

  if (!session.data?.user) {
    return (
      <Layout>
        <div>Du m?? logge inn f??r du kan gj??re g??ye ting</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <StyledHeader>
          <Heading>Musikkjulekalender 2022!</Heading>
          <HorisontalDraggable>
            <Box
              textAlign="center"
              transition="transform .2s"
              _hover={{ transform: "scale(1.1)" }}
            >
              <Image
                draggable={false}
                src={nisse}
                alt="Rockete julsenisse med gitar"
                width={300}
                height={300}
              />
            </Box>
          </HorisontalDraggable>
        </StyledHeader>
        <main>
          <TopGrid>
            <BestDaily todayAnswers={props.todayAnswers} />
            <UserStats userScores={props.userScores ?? []} />
            <TopScores scores={props.scores ?? []} />
          </TopGrid>
          <Spacer />
          <Grid>
            {props.days.map((day) => (
              <GridItem key={day.id}>
                <Day day={day} />
              </GridItem>
            ))}
          </Grid>
        </main>
      </div>
      <Footer />
    </Layout>
  );
};

export default Blog;
