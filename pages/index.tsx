import React from "react";
import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import styled from "styled-components";
import Day, { DayProps } from "../components/Day";
import prisma from "../lib/prisma";

export const getServerSideProps: GetServerSideProps = async () => {
  const feed = await prisma.day.findMany();

  const feedWithFixedDates = feed.map((el) => ({
    ...el,
    solutionDate: el.solutionDate.toString(),
    revealDate: el.revealDate.toString(),
  }));
  return {
    props: { feed: feedWithFixedDates },
  };
};

type Props = {
  feed: DayProps[];
};

const HeaderImage = styled.div`
  text-align: left;
  padding-top: 1rem;
  color: rgb(255, 255, 255);
  display: flex;
`;

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div>
        <ImageContainer />
        <main>
          {props.feed.map((day) => (
            <div key={day.id}>
              <Day day={day} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default Blog;
