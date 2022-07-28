import React from "react";
import type { GetServerSideProps } from "next";
import Image from "next/image";
import nisse from "../img/julenissetransparent.png";
import Layout from "../components/Layout";
import styled from "styled-components";
import Day, { DayProps } from "../components/Day";
import prisma from "../lib/prisma";
import { Grid, GridItem } from "../components/Grid";
import { useSession } from "next-auth/react";

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

const ImageContainer = styled.div`
  height: 30rem;
  text-align: center;
`;

const Blog: React.FC<Props> = (props) => {
  const session = useSession();

  if (!session.data?.user) {
    return (
      <Layout>
        <div>Du må logge inn før du kan gjøre gøye ting</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <ImageContainer>
          <Image
            src={nisse}
            alt="Rockete julsenisse med gitar"
            width={300}
            height={300}
          />
        </ImageContainer>
        <main>
          <Grid>
            {props.feed.map((day) => (
              <GridItem key={day.id}>
                <Day day={day} />
              </GridItem>
            ))}
          </Grid>
        </main>
      </div>
    </Layout>
  );
};

export default Blog;
