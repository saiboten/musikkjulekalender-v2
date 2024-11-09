import { Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export const Footer = () => {
  return (
    (<Text
      fontSize="0.8rem"
      position="fixed"
      bottom="0"
      left="0"
      textAlign="center"
      width="100%"
      backgroundColor="white"
      padding="1rem 1rem"
    >Laget av Tobias Rusås Olsen -{" "}
      <NextLink href="/about" passHref legacyBehavior>
        <Link>Om musikkjulekalenderen</Link>
      </NextLink>
    </Text>)
  );
};
