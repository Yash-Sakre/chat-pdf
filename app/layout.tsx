import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Outfit } from "next/font/google";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/Contexts/ThemeContext";

export const metadata: Metadata = {
  title: "Chat Pdf",
  description: "Made by Yash",
};

export const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <ClerkProvider>
        <html lang="en">
          <body className={`${outfit.className} antialiased`}>
            <Provider>{children}</Provider>
          </body>
        </html>
      </ClerkProvider>
    </ThemeProvider>
  );
}
