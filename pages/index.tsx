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
import { Heading } from "@chakra-ui/react";
import { Footer } from "../components/Footer";
import { HorisontalDraggable } from "../components/lib/HorisontalDraggable";

export const getServerSideProps: GetServerSideProps = async () => {
  const feed = await prisma.day.findMany({
    orderBy: {
      date: "asc",
    },
  });

  const feedWithFixedDates = feed.map((el) => ({
    id: el.id,
    date: el.date.toString(),
  }));
  return {
    props: { feed: feedWithFixedDates },
  };
};

type Props = {
  feed: DayProps[];
};

const ImageContainer = styled.div`
  height: 20rem;
  text-align: center;
`;

const StyledHeader = styled.div`
  text-align: left;
  padding-top: 1rem;
  display: flex;

  @media screen and (max-width: 45rem) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
  }
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
        <StyledHeader>
          <Heading>Musikkjulekalender!</Heading>
          <HorisontalDraggable>
            <ImageContainer>
              <Image
                draggable={false}
                src={nisse}
                alt="Rockete julsenisse med gitar"
                width={300}
                height={300}
              />
            </ImageContainer>
          </HorisontalDraggable>
        </StyledHeader>
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
      <Footer />
    </Layout>
  );
};

export default Blog;
