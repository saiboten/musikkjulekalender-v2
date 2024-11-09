import React from "react";
import styled from "styled-components";
import NextLink from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  Box,
  Link,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Admin } from "./Admin";
import { PrimaryRed } from "./constants";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  background-color: ${PrimaryRed};
  padding: 1rem;
  gap: 1.5rem;
  color: #fff;
  align-items: flex-start;
`;

const Header: React.FC = () => {
  const { data: session, status } = useSession();

  <NextLink href="/create" passHref legacyBehavior>
    <Link mr="2">Opprett dag</Link>
  </NextLink>;

  let right = null;

  if (status === "loading") {
    right = <p>Laster ...</p>;
  }

  if (!session) {
    right = (
      <Menu>
        <MenuButton
          as={Button}
          backgroundColor={PrimaryRed}
          _hover={{
            backgroundColor: PrimaryRed,
            outline: "1px solid",
            outlineColor: "#000",
          }}
          _active={{ backgroundColor: PrimaryRed }}
        >
          <HamburgerIcon />
        </MenuButton>
        <MenuList>
          <NextLink href="/api/auth/signin" passHref legacyBehavior>
            <MenuItem color="black">Logg inn</MenuItem>
          </NextLink>
          <NextLink href="/about" passHref legacyBehavior>
            <MenuItem color="black" mr="2">
              Om kalenderen
            </MenuItem>
          </NextLink>
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
            _hover={{
              backgroundColor: PrimaryRed,
              outline: "1px solid",
              outlineColor: "#000",
            }}
            _active={{ backgroundColor: PrimaryRed }}
          >
            <HamburgerIcon />
          </MenuButton>
          <MenuList>
            <Admin>
              <NextLink href="/create" passHref legacyBehavior>
                <MenuItem color="black" mr="2">
                  Opprett dag
                </MenuItem>
              </NextLink>
              <NextLink href="/admin" passHref legacyBehavior>
                <MenuItem color="black" mr="2">
                  Admin
                </MenuItem>
              </NextLink>
            </Admin>
            <NextLink href="/settings" passHref legacyBehavior>
              <MenuItem color="black" mr="2">
                Innstillinger
              </MenuItem>
            </NextLink>
            <NextLink href="/about" passHref legacyBehavior>
              <MenuItem color="black" mr="2">
                Om kalenderen
              </MenuItem>
            </NextLink>
            <MenuItem
              color="black"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logg ut
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    );
  }

  return (
    (<Nav>
      <Box
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <NextLink href="/" passHref legacyBehavior>
          <Link display="inline" mr="5" fontSize="24px">
            Musikkjulekalender!
          </Link>
        </NextLink>

        {/* {session?.user ? (
          <Box>
            <Text>
              {session.user.name} ({session.user.email})
            </Text>
          </Box>
        ) : null} */}
        {right}
      </Box>
    </Nav>)
  );
};

export default Header;
