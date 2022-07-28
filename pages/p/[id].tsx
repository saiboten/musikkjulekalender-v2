import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import Layout from "../../components/Layout";
import { format, isBefore, isSameDay } from "date-fns";
import Countdown from "react-countdown";
import Router from "next/router";
import { DayProps } from "../../components/Day";
import prisma from "../../lib/prisma";
import { useSession } from "next-auth/react";
import { Box, Button, Heading, Input, Link, Text } from "@chakra-ui/react";
import { Difficulty } from "../../components/Difficulty";
import { YoutubeVideo } from "../../components/lib/YoutubeVideo";
import NextLink from "next/link";
import { Spacer } from "../../components/lib/Spacer";
import { Audio } from "../../components/lib/Audio";
import { Thumbnail } from "../../components/Thumbnail";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.day.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
  });

  const isToday = isSameDay(post.date, new Date());
  const isDayPassed = isBefore(post.date, new Date());

  const postWithFixedDates = {
    ...post,
    date: post.date.toISOString(),
    isToday,
    isDayPassed,
  };

  if (!isToday && !isDayPassed) {
    return {
      props: {
        date: post.date.toISOString(),
        isToday,
        isDayPassed,
      },
    };
  }

  return {
    props: postWithFixedDates,
  };
};

async function deletePost(id: number): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  });
  await Router.push("/");
}

interface DayWithAdmin extends DayProps {
  isAdmin: boolean;
}

const AdminEditLink = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <NextLink href={`/edit/${id}`} passHref>
      <Link>Edit</Link>
    </NextLink>
  );
};

const Today: React.FC<DayWithAdmin> = (props) => {
  const [answer, setAnswer] = useState("");

  async function handleAnswer() {
    const res = await fetch(`/api/answer?guess=${answer}`);
  }

  return (
    <Layout>
      <AdminEditLink />
      <div>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Difficulty difficulty={props.difficulty ?? 1} />
          <Thumbnail image={props.madeBy} />
        </Box>
        <Heading>{format(new Date(props.date), "d 'dag jul")}</Heading>
        <Spacer multiply={0.5} />
        {props.video ? <YoutubeVideo link={props.video}></YoutubeVideo> : null}
        {props.file ? (
          <Audio controls src={props.file}>
            Your browser does not support the
            <code>audio</code> element.
          </Audio>
        ) : null}
        <Spacer multiply={0.5} />
        <Text>{props.description}</Text>
        <Spacer />
        <Heading size="md">Svar</Heading>
        <Spacer multiply={0.5} />
        <Box display="flex">
          <Input
            placeholder="Legg inn ditt svar her"
            name="svar"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            mr="10px"
          ></Input>
          <Button disabled={answer === ""} onClick={handleAnswer}>
            Gjett
          </Button>
        </Box>
      </div>
    </Layout>
  );
};

const OldDay: React.FC<DayWithAdmin> = (props) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <Layout>
      <AdminEditLink />
      <Box textAlign="center">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Difficulty difficulty={props.difficulty ?? 1} />
          <Thumbnail image={props.madeBy} />
        </Box>
        <Heading>{format(new Date(props.date), "d 'dag jul")}</Heading>
        <Spacer multiply={0.5} />
        {props.video ? <YoutubeVideo link={props.video}></YoutubeVideo> : null}
        {props.file ? (
          <Audio controls src={props.file}>
            Your browser does not support the
            <code>audio</code> element.
          </Audio>
        ) : null}
        <Spacer multiply={0.5} />
        <Box textAlign="left" maxWidth="30rem" m="0 auto">
          <Text>{props.description}</Text>
          <Spacer multiply={0.5} />
          {showSolution ? null : (
            <Button onClick={() => setShowSolution(true)}>Vis fasit</Button>
          )}
          {showSolution ? (
            <>
              <Heading>Fasit</Heading>
              <Text textAlign="center" fontWeight="bold" fontSize="22px">
                {props.artist} - {props.song}
              </Text>
              <YoutubeVideo link={props.solutionVideo} />
            </>
          ) : null}
          <Spacer multiply={1} />
        </Box>
      </Box>
    </Layout>
  );
};

const Post: React.FC<DayProps> = (props) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  const isAdmin = session.user.role === "admin";

  if (props.isToday) {
    return <Today isAdmin={isAdmin} {...props} />;
  } else if (props.isDayPassed) {
    return <OldDay isAdmin={isAdmin} {...props} />;
  }

  return (
    <Layout>
      <AdminEditLink />
      <div>
        <Heading>{format(new Date(props.date), "d 'dag jul")}</Heading>
        <Text>
          Tid før luken åpner: <Countdown date={new Date(props.date)} />
        </Text>
      </div>
    </Layout>
  );
};

export default Post;
