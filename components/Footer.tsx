import NextLink from "next/link";

export const Footer = () => {
  return (
    <p className="fixed bottom-0 left-0 w-full bg-white p-4 text-center text-[0.8rem]">
      Laget av Tobias Rusås Olsen -{" "}
      <NextLink href="/about" className="hover:underline">
        Om musikkjulekalenderen
      </NextLink>
    </p>
  );
};
