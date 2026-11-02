"use client";

import { Button } from "./ui";
import { useState } from "react";
import { Audio } from "./lib/Audio";
import { Spacer } from "./lib/Spacer";

export function Hint({
  hint,
  hintNumber,
  id,
  fileHintExists,
}: {
  hint: string;
  hintNumber: 1 | 2 | 3;
  id: number;
  fileHintExists?: boolean;
}) {
  const [show, setShow] = useState(false);

  if (show) {
    return (
      <>
        <p>
          <span className="font-bold">Hint {hintNumber}</span>:{" "}
          {fileHintExists ? "Lydfil:" : hint}
        </p>
        {fileHintExists ? (
          <Audio controls preload="none" src={`/api/hint/${id}/${hintNumber}`}>
            Your browser does not support the
            <code>audio</code> element.
          </Audio>
        ) : null}
        <Spacer multiply={0.5} />
      </>
    );
  }

  return (
    <div>
      <Button onClick={() => setShow(true)}>
        Vis hint nummer {hintNumber}
      </Button>{" "}
    </div>
  );
}
