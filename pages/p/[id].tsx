import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { format, isBefore, isSameDay } from "date-fns";
import Router from "next/router";
import { DayProps } from "../../components/Day";
import prisma from "../../lib/prisma";
import { useSession } from "next-auth/react";
import { Heading, Text } from "@chakra-ui/react";
import { Difficulty } from "../../components/Difficulty";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.day.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
  });

  const isToday = isSameDay(post.date, new Date());

  const postWithFixedDates = {
    ...post,
    date: post.date.toISOString(),
    isToday,
  };

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

const Post: React.FC<DayProps> = (props) => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  return (
    <Layout>
      <div>
        <Heading>{format(new Date(props.date), "d 'dag jul")}</Heading>
        <Text>{props.description}</Text>
        <Difficulty difficulty={props.difficulty ?? 1} />
        <Text>Video: {props.video}</Text>
        <Text>Artist: {props.artist}</Text>
        <Text>Sang: {props.song}</Text>
        {props.isToday ? "Hurra det er i dag!" : "Nei, ikke i dag"}
      </div>
    </Layout>
  );
};

export default Post;
