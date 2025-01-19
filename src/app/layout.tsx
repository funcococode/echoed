import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "sonner";
const inter = Inter({
  subsets: ['latin'],
  display: 'swap'
})


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <head>
        <title>Echoed</title>
      </head>
      <body className="max-w-[70%] mx-auto min-h-screen overflow-y-scroll">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
