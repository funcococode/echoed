import "@/styles/globals.css";

import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
const inter = Inter({
  subsets: ['latin'],
  display: 'swap'
})

interface Props {
  children: ReactNode,
  modal: ReactNode,
  loader: ReactNode
}

export default function RootLayout({
  children,
  modal,
  loader
}: Readonly<Props>) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <head>
        <title>Echoed</title>
      </head>
      <body className="max-w-[90%] md:max-w-[70%] mx-auto min-h-screen overflow-y-scroll">
        <Toaster />
        {children}
        <div className="z-20 relative">
          {modal}
          {loader}
        </div>
        <div id="overlays"></div>
      </body>
    </html>
  );
}
