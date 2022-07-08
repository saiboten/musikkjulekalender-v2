import React from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import Router from "next/router";
import { DayProps } from "../../components/Day";
import prisma from "../../lib/prisma";
import { useSession } from "next-auth/react";
import { Heading, Text } from "@chakra-ui/react";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.day.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
  });

  const postWithFixedDates = {
    ...post,
    solutionDate: post.solutionDate.toString(),
    revealDate: post.revealDate.toString(),
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
  const userHasValidSession = Boolean(session);
  // const postBelongsToUser = session?.user?.email === props.author?.email;

  return (
    <Layout>
      <div>
        <Heading>Dag 1</Heading>
        <Text>{props?.description}</Text>
        {/* <ReactMarkdown>{props.content}</ReactMarkdown> */}

        {/* {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.id)}>Delete</button>
        )} */}
      </div>
    </Layout>
  );
};

export default Post;
