import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkedOS – AI LinkedIn Post Generator",
  description: "Genera post LinkedIn professionali con l'AI",
};

const themeScript = `
(function(){
  var t=localStorage.getItem('theme');
  var d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches);
  if(d)document.documentElement.classList.add('dark');
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className="min-h-full flex flex-col transition-colors duration-300"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
