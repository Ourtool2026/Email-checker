import type { Metadata, Viewport } from "next"

import "@fontsource-variable/inter"
import "@fontsource-variable/rubik"
import "@fontsource-variable/geist-mono"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "MyStay ID HQ",
  description:
    "Internal admin dashboard for MyStay ID and MyStay for Business.",
  icons: { icon: "/brand-mark.png" },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

// Apply the saved sidebar theme and accent before first paint (light/dark is next-themes').
const PAINT_SCRIPT = `try{var r=document.documentElement,l=JSON.parse(localStorage.getItem("hq-look")||"{}");r.dataset.side=l.side||"light";r.dataset.accent=l.accent||"blue";if(l.density)r.dataset.density=l.density;if(l.text)r.dataset.text=l.text}catch(e){}`

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="font-sans antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: PAINT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider defaultTheme="light" storageKey="hq-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
