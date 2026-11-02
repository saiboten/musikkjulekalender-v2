import React from "react";
import { isBefore } from "date-fns";
import Layout from "../components/Layout";
import Day from "../components/Day";
import { prisma } from "../lib/prisma";
import { getSession } from "../lib/auth";
import { getSolvedAnswers } from "../lib/answers";
import { Grid, GridItem } from "../components/Grid";
import { Footer } from "../components/Footer";
import { TopScores } from "../components/TopScores";
import { UserStats } from "../components/UserStats";
import { BestDaily } from "../components/BestDaily";
import { Spacer } from "../components/lib/Spacer";
import { getToday } from "../utils/dates";
import { LoggedOut } from "../components/LoggedOut";
import { MainHeading } from "../components/MainHeading";
import { P } from "../components/lib/Paragraph";
import { FrontPageBox } from "../components/FrontPageBox";
import { Heading } from "../components/ui";

export default async function FrontPage() {
  const session = await getSession();

  if (!session?.user) {
    return <LoggedOut />;
  }

  const today = getToday();

  const todayDay = await prisma.day.findFirst({
    where: {
      date: today,
    },
  });

  const texts = await prisma.texts.findFirst();

  const days = await prisma.day.findMany({
    orderBy: {
      date: "asc",
    },
    include: {
      answers: {
        where: {
          userId: session.id ?? -1,
        },
      },
    },
  });

  const todayAnswers = await getSolvedAnswers(todayDay?.id);

  const userScores = days
    .filter((day) => isBefore(day.date, new Date()))
    .map((el) => ({
      day: el.date.toISOString(),
      score: el.answers.reduce((sum, next) => sum + next.points, 0),
    }));

  const users = await prisma.user.findMany({
    include: {
      answer: true,
    },
  });

  const scores = users
    .map((user) => ({
      name: user.nickname ?? user.email?.split("@")[0] ?? "ukjent",
      score: user.answer.reduce((sum, next) => sum + next.points, 0),
      id: user.id,
    }))
    .sort((el1, el2) => (el1.score > el2.score ? -1 : 1));

  return (
    <Layout>
      <div>
        <MainHeading />
        {texts?.frontpageMessage ? (
          <FrontPageBox>
            <Heading>{texts.frontpageHeading}</Heading>
            <P>{texts.frontpageMessage}</P>
          </FrontPageBox>
        ) : null}

        <Spacer />
        <main>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4">
            <BestDaily frontPage todayAnswers={todayAnswers} />
            <UserStats userScores={userScores} />
            <TopScores scores={scores} />
          </div>
          <Spacer />
          <Grid>
            {days.map((day) => (
              <GridItem key={day.id}>
                <Day
                  day={{ id: day.id, date: day.date.toISOString() }}
                  today={today}
                />
              </GridItem>
            ))}
          </Grid>
        </main>
      </div>
      <Footer />
    </Layout>
  );
}
