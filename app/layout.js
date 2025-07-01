import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider.jsx";
import Header from "@/components/header.jsx";
import { ClerkProvider } from "@clerk/nextjs";

const inter=Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});


export const metadata = {
  title: "Hisabbook",
  description: "The best way to split bills with friends",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/logos/logo-s.png"
          sizes="any"
        />   
      </head>
      <body
        className={`${inter.className}`}
      >
      <ClerkProvider>
      <ConvexClientProvider>
        <Header/>
        <main className="min-h-screen">
          {children}
        </main>
      </ConvexClientProvider>
      </ClerkProvider>
      </body>
    </html>
  );
}
