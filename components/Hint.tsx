"use client";

import { useState } from "react";
import { Button } from "./ui";
import { HintAudio, HintRow } from "./DayLayout";

/** A hint on a passed day, hidden until the player asks to see it. */
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

  return (
    <HintRow number={hintNumber}>
      {show ? (
        <>
          {hint ? <p>{hint}</p> : null}
          {fileHintExists ? <HintAudio id={id} number={hintNumber} /> : null}
        </>
      ) : (
        <Button className="-mt-1.5 h-9 text-sm" onClick={() => setShow(true)}>
          Vis hint {hintNumber}
        </Button>
      )}
    </HintRow>
  );
}
