import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "AI Movie Studio",
  description: "Hybrid multi-AI movie recap and subtitle workspace"
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="my"><body>{children}</body></html>;
}