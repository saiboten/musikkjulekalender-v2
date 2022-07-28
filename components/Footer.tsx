import { Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export const Footer = () => {
  return (
    <Text
      position="fixed"
      textAlign="center"
      width="100%"
      left="50%"
      bottom="0"
      marginLeft="-50%"
      backgroundColor="white"
      padding="5px 10px"
    >
      Av Tobias Rusås Olsen -{" "}
      <NextLink href="/about" passHref>
        <Link>Om musikkjulekalenderen</Link>
      </NextLink>
    </Text>
  );
};
