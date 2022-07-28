import { Box, Heading, Text } from "@chakra-ui/react";
import styled from "styled-components";
import { format } from "date-fns";
import Countdown from "react-countdown";
import { AdminEditLink } from "../pages/p/[id]";
import Layout from "./Layout";
import { Spacer } from "./lib/Spacer";
import { countdownRenderer } from "./Countdown";

interface Props {
  date: Date;
}

export const FutureDay = (props: Props) => {
  return (
    <Layout whiteBg>
      <AdminEditLink />
      <Box textAlign="center">
        <Heading>{format(new Date(props.date), "d 'dag jul")}</Heading>
        <Spacer />
        <Text>
          Tid før luken åpner: <Spacer />
          <Countdown renderer={countdownRenderer} date={new Date(props.date)} />
        </Text>
      </Box>
    </Layout>
  );
};
