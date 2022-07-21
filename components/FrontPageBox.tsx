import { Box } from "@chakra-ui/react";
import React from "react";

export const FrontPageBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      backgroundColor="#fff"
      padding="2"
      borderRadius="5px"
      boxShadow="rgb(0 0 0 / 50%) 1px 2px 4px 0px"
    >
      {children}
    </Box>
  );
};
