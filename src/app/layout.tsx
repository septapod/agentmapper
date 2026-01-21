import type { Metadata } from "next";
import { Montserrat, Karla } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgentMapper",
  description:
    "Turn AI ambitions into a concrete 90-day roadmap. A self-guided workshop for teams planning Agentic AI implementation.",
  keywords: [
    "AgentMapper",
    "Agentic AI",
    "AI Implementation",
    "AI Roadmap",
    "AI Workshop",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${karla.variable} antialiased`}
        style={{
          fontFamily: "var(--font-karla), var(--font-body)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
