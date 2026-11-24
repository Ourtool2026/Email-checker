import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata = {
  title: "MyStay ID HQ",
  description: "Internal admin dashboard for MyStay ID and MyStay for Business.",
  icons: { icon: "/brand-mark.png" },
};

// Apply saved theme before first paint to avoid a light/dark flash.
const themeScript = `try{var r=document.documentElement,g=function(k){return JSON.parse(localStorage.getItem(k))};if(g("hq-dark"))r.classList.add("dark");var s=g("hq-side");if(s)r.dataset.side=s;var l=g("hq-look");if(l&&l.accent)r.dataset.accent=l.accent}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
