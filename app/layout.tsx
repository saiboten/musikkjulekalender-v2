import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Rubik } from "next/font/google";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import { getSession } from "../lib/auth";
import bg from "../img/bg.jpg";
import { Providers } from "./providers";
import "../styles/globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "Musikkjulekalender",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="nb" className={rubik.variable}>
      <body>
        <Providers session={session}>
          <div>
            <div className="fixed -z-1 h-screen w-screen overflow-hidden">
              <Image
                alt="Mountains"
                src={bg}
                fill
                sizes="100vw"
                quality={100}
                className="object-cover"
              />
            </div>
            <Header />
            <div className="mx-auto mb-24 block max-w-[120rem] rounded-[5px]">
              {children}
            </div>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
