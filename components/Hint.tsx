import { Button, Text } from "@chakra-ui/react";
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
        <Text>
          <Text display="inline" fontWeight="bold">
            Hint {hintNumber}
          </Text>
          : {fileHintExists ? "Lydfil:" : hint}
        </Text>
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
