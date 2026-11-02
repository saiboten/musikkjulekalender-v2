"use client";

import React from "react";
import NextLink from "next/link";
import { useSession } from "./session";
import { authClient } from "../lib/auth-client";
import { Admin } from "./Admin";
import { HamburgerIcon, Menu, MenuItem, buttonClasses } from "./ui";

const menuButtonClasses = buttonClasses(
  "default",
  "bg-primary text-white hover:bg-primary hover:outline hover:outline-1 hover:outline-black active:bg-primary"
);

const Header: React.FC = () => {
  const { data: session } = useSession();

  let right = null;

  if (!session) {
    right = (
      <Menu
        label={<HamburgerIcon />}
        buttonAriaLabel="Meny"
        buttonClassName={menuButtonClasses}
      >
        <MenuItem href="/auth/signin">Logg inn</MenuItem>
        <MenuItem href="/about">Om kalenderen</MenuItem>
      </Menu>
    );
  }

  if (session) {
    right = (
      <Menu
        label={<HamburgerIcon />}
        buttonAriaLabel="Meny"
        buttonClassName={menuButtonClasses}
      >
        <Admin>
          <MenuItem href="/create">Opprett dag</MenuItem>
          <MenuItem href="/admin">Admin</MenuItem>
        </Admin>
        <MenuItem href="/settings">Innstillinger</MenuItem>
        <MenuItem href="/about">Om kalenderen</MenuItem>
        <MenuItem
          onClick={async () => {
            await authClient.signOut();
            // Full reload, so the server-rendered layout drops the session too.
            window.location.href = "/";
          }}
        >
          Logg ut
        </MenuItem>
      </Menu>
    );
  }

  return (
    <nav className="flex w-full flex-col items-start justify-between gap-6 bg-primary p-4 text-white">
      <div className="flex w-full items-center justify-between">
        <NextLink href="/" className="mr-5 inline text-2xl hover:underline">
          Musikkjulekalender!
        </NextLink>
        {right}
      </div>
    </nav>
  );
};

export default Header;
