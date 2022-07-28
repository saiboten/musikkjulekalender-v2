import React from "react";
import { GetServerSideProps } from "next";
import Router, { useRouter } from "next/router";
import { DayProps } from "../../components/Day";
import prisma from "../../lib/prisma";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import { FormData } from "../../components/CreateDayForm";
import { CreateDayForm } from "../../components/CreateDayForm";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.day.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      solution: true,
      file: true,
    },
  });

  const postWithFixedDates = {
    ...post,
    date: post.date.toISOString(),
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
  const router = useRouter();

  const { id } = router.query;

  const onSubmit = async (data: FormData) => {
    const solutions = data.solutions.map((el) => el.value);
    const { solutions: do_not_use, ...rest } = data;

    try {
      const body = { ...rest, solutions };

      await fetch(`/api/day/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push(`/p/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  if (session?.user.role !== "admin") {
    return null;
  }

  return (
    <CreateDayForm {...props} onSubmit={onSubmit} submitButtonText="Lagre" />
  );
};

export default Post;
