import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

const Providers = dynamic(() => import("./providers").then((mod) => ({ default: mod.Providers })), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Cryptocheliks - Private Pixel Character Builder",
  description: "Create and share encrypted pixel characters with FHEVM",
=======
  title: "Smart Budget Tracker - Private Budget Management",
  description: "Manage your budget privately with Fully Homomorphic Encryption",
>>>>>>> 5175f1f88449627993d74a1cab7c15099a0d7ac1
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

<<<<<<< HEAD

=======
>>>>>>> 5175f1f88449627993d74a1cab7c15099a0d7ac1
