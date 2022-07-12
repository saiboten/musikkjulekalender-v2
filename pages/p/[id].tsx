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
import { Video } from "../../components/lib/Video";
import NextLink from "next/link";

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
        <Video link={props.video}></Video>
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
        <Heading>{format(new Date(props.date), "d 'dag jul")}</Heading>
        <Video link={props.video} />
        <Text>{props.description}</Text>
        <Difficulty difficulty={props.difficulty ?? 1} />
        {showSolution ? null : (
          <Button onClick={() => setShowSolution(true)}>Vis løsning</Button>
        )}
        {showSolution ? (
          <>
            <Text>{props.solutionVideo}</Text>
            <Text>Artist: {props.artist}</Text>
            <Text>Sang: {props.song}</Text>
          </>
        ) : null}
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
