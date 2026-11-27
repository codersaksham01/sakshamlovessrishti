import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "For You, Always", description: "A little corner of the internet, made with love.", robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
