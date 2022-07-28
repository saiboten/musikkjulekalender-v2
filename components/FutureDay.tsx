import { Box, Heading, Text } from "@chakra-ui/react";
import styled from "styled-components";
import { format } from "date-fns";
import Countdown from "react-countdown";
import { AdminEditLink } from "../pages/p/[id]";
import Layout from "./Layout";
import { Spacer } from "./lib/Spacer";

interface Props {
  date: Date;
}

const StyledCard = styled.div`
  width: 5rem;
  height: 6rem;
  border-radius: 10px;
  background-color: #eaf2eb;
  color: #174e1e;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return null;
  } else {
    // Render a countdown
    return (
      <Box display="flex" gap=".5rem" justifyContent="center">
        <StyledCard>
          <Box fontSize={"2.2rem"}>{hours}</Box>
          <Box>timer</Box>
        </StyledCard>
        <StyledCard>
          <Box fontSize={"2.2rem"}>{minutes}</Box>
          <Box>minutter</Box>
        </StyledCard>
        <StyledCard>
          <Box fontSize={"2.2rem"}>{seconds}</Box>
          <Box>sekunder</Box>
        </StyledCard>
      </Box>
    );
  }
};

export const FutureDay = (props: Props) => {
  return (
    <Layout whiteBg>
      <AdminEditLink />
      <Box textAlign="center">
        <Heading>{format(new Date(props.date), "d 'dag jul")}</Heading>
        <Spacer />
        <Text>
          Tid før luken åpner: <Spacer />
          <Countdown renderer={renderer} date={new Date(props.date)} />
        </Text>
      </Box>
    </Layout>
  );
};
