import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const Nav = styled.nav`
  display: flex;
  -webkit-box-pack: end;
  justify-content: flex-end;
`;

const NavItem = styled.div`
  font-size: 1rem;
  padding: 0.5rem;
  min-width: 5rem;
  justify-content: center;
  align-items: center;
  display: flex;
  text-align: center;
  text-decoration: none;
  overflow-wrap: break-word;
  border-radius: 5px;
  box-shadow: black 0px 2px 5px;
  background-color: white;
  margin-right: 0.5rem;
`;

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  let left = (
    <NavItem>
      <Link href="/">
        <a data-active={isActive("/")}>Forsiden</a>
      </Link>
    </NavItem>
  );

  let right = null;

  if (status === "loading") {
    right = (
      <NavItem>
        <p>Validating session ...</p>
      </NavItem>
    );
  }

  if (!session) {
    right = (
      <NavItem>
        <Link href="/api/auth/signin">
          <a data-active={isActive("/signup")}>Logg inn</a>
        </Link>
      </NavItem>
    );
  }

  if (session) {
    left = (
      <NavItem>
        <Link href="/">
          <a className="bold" data-active={isActive("/")}>
            Forsiden
          </a>
        </Link>
      </NavItem>
    );
    right = (
      <>
        <NavItem>
          <Link href="/create">
            <button>
              <a>Opprett dag</a>
            </button>
          </Link>
        </NavItem>
        <NavItem>
          <button onClick={() => signOut()}>
            <a>Logg ut</a>
          </button>
        </NavItem>
      </>
    );
  }

  return (
    <Nav>
      {session?.user ? (
        <p>
          {session.user.name} ({session.user.email})
        </p>
      ) : null}

      {left}
      <NavItem>
        <Link href="/about">
          <a data-active={isActive("/about")}>Om</a>
        </Link>
      </NavItem>
      {right}
    </Nav>
  );
};

export default Header;
