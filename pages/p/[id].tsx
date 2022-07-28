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
import { Box, Button, Heading, Link, Text } from "@chakra-ui/react";
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
  return (
    <Layout>
      <AdminEditLink />
      <div>
        <Heading>{format(new Date(props.date), "d 'dag jul")}</Heading>
        {props.video ? <YoutubeVideo link={props.video}></YoutubeVideo> : null}
        {props.file ? (
          <Audio controls src={props.file}>
            Your browser does not support the
            <code>audio</code> element.
          </Audio>
        ) : null}
        <Text>{props.description}</Text>
        <Difficulty difficulty={props.difficulty ?? 1} />
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
            <Button onClick={() => setShowSolution(true)}>Vis løsning</Button>
          )}
          {showSolution ? (
            <>
              <YoutubeVideo link={props.solutionVideo} />
              <Text>Artist: {props.artist}</Text>
              <Text>Sang: {props.song}</Text>
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
