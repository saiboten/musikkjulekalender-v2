/** An mp3 response from a base64-encoded file stored in the database. */
export function audioResponse(base64: string | null | undefined) {
  return new Response(new Uint8Array(Buffer.from(base64 ?? "", "base64")), {
    headers: { "Content-Type": "audio/mpeg" },
  });
}

export const numberToHintFile = {
  1: "hint1file",
  2: "hint2file",
  3: "hint3file",
} as const;
