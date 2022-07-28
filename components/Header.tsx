import React from "react";
import styled from "styled-components";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import {
  Box,
  Link,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
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
  opacity: 0.9;

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
      <Menu>
        <MenuButton
          as={Button}
          backgroundColor={PrimaryRed}
          _hover={{ backgroundColor: PrimaryRed }}
          _active={{ backgroundColor: PrimaryRed }}
        >
          <HamburgerIcon />
        </MenuButton>
        <MenuList>
          <MenuItem color="black">
            <NextLink href="/api/auth/signin" passHref>
              <Link>Logg inn</Link>
            </NextLink>
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }

  if (session) {
    right = (
      <>
        <Menu>
          <MenuButton
            as={Button}
            backgroundColor={PrimaryRed}
            _hover={{ backgroundColor: PrimaryRed }}
            _active={{ backgroundColor: PrimaryRed }}
          >
            <HamburgerIcon />
          </MenuButton>
          <MenuList>
            <Admin>
              <MenuItem color="black">
                <NextLink href="/create" passHref>
                  <Link mr="2">Opprett dag</Link>
                </NextLink>
              </MenuItem>
            </Admin>
            <MenuItem color="black">
              <Link onClick={() => signOut({ callbackUrl: "/" })}>Logg ut</Link>
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    );
  }

  return (
    <Nav>
      <Box>
        <NextLink href="/" passHref>
          <Link display="inline" mr="5" fontSize="24px">
            Musikkjulekalender!
          </Link>
        </NextLink>
      </Box>
      <Box
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        justifyContent="flex-end"
        alignItems="center"
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
