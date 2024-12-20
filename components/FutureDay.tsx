import { Box, Button, Heading, Text } from "@chakra-ui/react";
import styled from "styled-components";
import { format, parseISO } from "date-fns";
import Countdown from "react-countdown";
import { AdminEditLink } from "../pages/p/[id]";
import Layout from "./Layout";
import { Spacer } from "./lib/Spacer";
import { countdownRenderer } from "./Countdown";
import Link from "next/link";

interface Props {
  date: string;
}

export const FutureDay = (props: Props) => {
  return (
    <Layout whiteBg>
      <AdminEditLink />
      <Link href="/">
        <Button>Tilbake</Button>
      </Link>
      <Box textAlign="center">
        <Heading>{format(parseISO(props.date), "d 'desember")}</Heading>
        <Spacer />
        <Box>
          Tid før luken åpner: <Spacer />
          <Countdown renderer={countdownRenderer} date={parseISO(props.date)} />
        </Box>
      </Box>
    </Layout>
  );
};
