"use client";

import React, { useEffect, useId, useRef } from "react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  cancelText: string;
  confirmText: string;
}

/**
 * Modal confirmation dialog. Focuses the cancel button when opened,
 * closes on Escape and when clicking the backdrop.
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  cancelText,
  confirmText,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    // Escape is handled natively by <dialog> (onCancel); onClick only adds backdrop clicks.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Clicks on the backdrop land on the <dialog> element itself.
        if (e.target === dialogRef.current) onClose();
      }}
      className="mx-auto my-16 w-full max-w-md rounded-md bg-white p-0 text-ink shadow-lg backdrop:bg-black/50"
    >
      <h2 id={titleId} className="px-6 py-4 text-lg font-bold">
        {title}
      </h2>
      <div className="px-6 py-2">{children}</div>
      <div className="flex justify-end px-6 py-4">
        <Button ref={cancelRef} onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant="danger" className="ms-3" onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </dialog>
  );
}
