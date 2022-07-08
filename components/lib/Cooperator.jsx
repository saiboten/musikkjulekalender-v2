import React from "react";

export function Cooperator({ cooperator }) {
  if (!cooperator) {
    return <div />;
  }

  return (
    <div
      style={{
        marginTop: "0.5rem"
      }}
    >
      Oppgave av: <strong>{cooperator}</strong>
    </div>
  );
}
