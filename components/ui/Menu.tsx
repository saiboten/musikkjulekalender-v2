"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import NextLink from "next/link";
import { cn } from "./cn";

interface MenuProps {
  /** Content of the toggle button. */
  label: React.ReactNode;
  buttonClassName?: string;
  buttonAriaLabel?: string;
  children: React.ReactNode;
}

const MenuContext = React.createContext<{ close: () => void }>({
  close: () => {},
});

export function Menu({
  label,
  buttonClassName,
  buttonAriaLabel,
  children,
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <MenuContext.Provider value={{ close: () => setOpen(false) }}>
      <div ref={rootRef} className="relative">
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={buttonAriaLabel}
          onClick={() => setOpen((o) => !o)}
          className={buttonClassName}
        >
          {label}
        </button>
        {open ? (
          <div
            id={listId}
            role="menu"
            className="absolute right-0 z-50 mt-2 min-w-56 rounded-md border border-[#e2e8f0] bg-white py-2 text-ink shadow-sm"
          >
            {children}
          </div>
        ) : null}
      </div>
    </MenuContext.Provider>
  );
}

const itemClasses =
  "block w-full px-3 py-1.5 text-left text-base text-black hover:bg-[#edf2f7] focus:bg-[#edf2f7] focus:outline-none";

export function MenuItem({
  href,
  onClick,
  className,
  children,
}: {
  href?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const { close } = React.useContext(MenuContext);

  if (href) {
    return (
      <NextLink
        href={href}
        role="menuitem"
        className={cn(itemClasses, className)}
        onClick={close}
      >
        {children}
      </NextLink>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      className={cn(itemClasses, className)}
      onClick={() => {
        close();
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}
