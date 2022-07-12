import React from "react";
import styled from "styled-components";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Link, Text } from "@chakra-ui/react";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: #8e1515;
  padding: 1.5rem 1rem;
  color: #fff;
`;

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

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
        <NextLink href="/create" passHref>
          <Link mr="2">Opprett dag</Link>
        </NextLink>
        <Link onClick={() => signOut()}>Logg ut</Link>
      </>
    );
  }

  return (
    <Nav>
      <div>
        <NextLink href="/" passHref>
          <Link display="inline" mr="5" pl="2">
            Musikkjulekalender!
          </Link>
        </NextLink>
      </div>
      <div>
        {session?.user ? (
          <Text display="inline" mr="2">
            {session.user.name} ({session.user.email})
          </Text>
        ) : null}
        {right}
      </div>
    </Nav>
  );
};

export default Header;
