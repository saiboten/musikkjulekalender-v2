import { Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export const Footer = () => {
  return (
    <Text
      textAlign="center"
      width="100%"
      backgroundColor="white"
      marginTop="20px"
      padding="5px 10px"
    >
      Av Tobias Rusås Olsen -{" "}
      <NextLink href="/about" passHref>
        <Link>Om musikkjulekalenderen</Link>
      </NextLink>
    </Text>
  );
};
