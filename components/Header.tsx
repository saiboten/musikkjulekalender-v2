import React from "react";
import styled from "styled-components";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Box, Link, Text } from "@chakra-ui/react";
import { Admin } from "./Admin";
import { PrimaryRed } from "./constants";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: ${PrimaryRed};
  padding: 1rem;
  gap: 1.5rem;
  color: #fff;
  align-items: center;

  @media screen and (max-width: 45rem) {
    flex-direction: column;
  }
`;

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  <NextLink href="/create" passHref>
    <Link mr="2">Opprett dag</Link>
  </NextLink>;

  let right = null;

  if (status === "loading") {
    right = <p>Validating session ...</p>;
  }

  if (!session) {
    right = (
      <NextLink href="/api/auth/signin" passHref>
        <Link>Logg inn</Link>
      </NextLink>
    );
  }

  if (session) {
    right = (
      <>
        <Admin>
          <NextLink href="/create" passHref>
            <Link mr="2">Opprett dag</Link>
          </NextLink>
        </Admin>

        <Link onClick={() => signOut({ callbackUrl: "/" })}>Logg ut</Link>
      </>
    );
  }

  return (
    <Nav>
      <div>
        <NextLink href="/" passHref>
          <Link display="inline" mr="5" fontSize="24px">
            Musikkjulekalender!
          </Link>
        </NextLink>
      </div>
      <Box
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        justifyContent="flex-end"
      >
        {session?.user ? (
          <>
            <Text mr="2">{session.user.name}</Text>
            <Text mr="2">({session.user.email})</Text>
          </>
        ) : null}
        {right}
      </Box>
    </Nav>
  );
};

export default Header;
