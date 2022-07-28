import { Box } from "@chakra-ui/react";
import styled from "styled-components";

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

export const countdownRenderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}) => {
  if (completed) {
    // Render a completed state
    return null;
  } else {
    // Render a countdown
    return (
      <Box display="flex" gap=".5rem" justifyContent="center">
        {days !== 0 ? (
          <StyledCard>
            <Box fontSize={"2.2rem"}>{days}</Box>
            <Box>dager</Box>
          </StyledCard>
        ) : null}

        <StyledCard>
          <Box fontSize={"2.2rem"}>{hours}</Box>
          <Box>timer</Box>
        </StyledCard>
        <StyledCard>
          <Box fontSize={"2.2rem"}>{minutes}</Box>
          <Box>minutter</Box>
        </StyledCard>
        {hours === 0 ? (
          <StyledCard>
            <Box fontSize={"2.2rem"}>{seconds}</Box>
            <Box>sekunder</Box>
          </StyledCard>
        ) : null}
      </Box>
    );
  }
};
