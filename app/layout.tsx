import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Sans_3, Ubuntu } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Navbar } from "@/components/navbar/nav";
import { auth } from "@/utils/auth";

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

const ubuntu = Ubuntu({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ['300', '400', '500', '700']
})
export const metadata: Metadata = {
  title: "DocuMind",
  description: "Turn your PDF into Ultimate study guide.",
  openGraph: {
    images: [
      {
        url: ''
      }
    ]
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await auth();

  return (

      <html lang="en" suppressHydrationWarning>
        <body
          className={` ${ubuntu.className} `}
        >
          <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
            
            <main className="flex-1">{children}</main>  
            <Toaster />
          </ThemeProvider>
        </body>
      </html>

  );
}
