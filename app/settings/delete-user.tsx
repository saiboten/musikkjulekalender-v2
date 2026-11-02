"use client";

import React, { useState } from "react";
import { Alert, Button, ConfirmDialog, Heading } from "../../components/ui";
import { Spacer } from "../../components/lib/Spacer";

export function DeleteUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const onClose = () => setIsOpen(false);

  async function handleDelete() {
    setDeleteConfirmed(true);
    await fetch("/api/deleteuser");
  }

  return (
    <>
      <Heading size="md">Slett bruker</Heading>
      <div className="flex items-center">
        <p className="mr-3">Vil du slette brukeren din?</p>
        <Button onClick={() => setIsOpen(true)}>Ja, slett brukeren min</Button>
      </div>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => {
          onClose();
          handleDelete();
        }}
        title="Slett bruker"
        cancelText="Cancel"
        confirmText="Delete"
      >
        Er du sikker? Du vil ikke kunne få tilbake brukeren din.
      </ConfirmDialog>

      {deleteConfirmed ? (
        <>
          <Spacer />
          <Alert status="success" icon title=":'(">
            Brukeren din vil bli slettet i løpet av få virkedager. Takk for alt!
          </Alert>
        </>
      ) : null}
    </>
  );
}
