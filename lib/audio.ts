/**
 * An audio response from a file stored in the database. Uploads are stored as
 * data URLs ("data:audio/mpeg;base64,…"); older rows may be bare base64.
 */
export function audioResponse(stored: string | null | undefined) {
  const match = /^data:([^;,]*)(?:;[^,]*)?,/.exec(stored ?? "");
  const base64 = match ? stored!.slice(match[0].length) : (stored ?? "");
  return new Response(new Uint8Array(Buffer.from(base64, "base64")), {
    headers: { "Content-Type": match?.[1] || "audio/mpeg" },
  });
}

export const numberToHintFile = {
  1: "hint1file",
  2: "hint2file",
  3: "hint3file",
} as const;
