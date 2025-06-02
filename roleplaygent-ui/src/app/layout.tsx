import type { Metadata } from "next";
import { UnifrakturMaguntia } from "next/font/google";
import "./globals.css";

const medievalFont = UnifrakturMaguntia({
  variable: "--font-medieval",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RolePlayGent - Fantasy Roleplay Adventure",
  description: "Create and explore unique fantasy roleplay adventures",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${medievalFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
