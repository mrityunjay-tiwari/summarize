import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const fontSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900']
})
export const metadata: Metadata = {
  title: "Make pdf summaries",
  description: "This application helps you make summaries of the pdf and put it like a set of flash cards before you",
  openGraph: {
    images: [
      {
        url: ''
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={` ${fontSans.variable} font-sans antialiased`}
        >
          <Header /> 
          <main className="flex-1">{children}</main>  
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
