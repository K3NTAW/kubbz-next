import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kubb Zürich - Kubb Tournament Management",
  description: "Kubb tournament management platform for the Zurich community",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SessionProviderWrapper>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 pt-16">{children}</main>
            <footer className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-8 mt-auto">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                      <Image
                        src="/logo.jpg"
                        alt="Kubb Zürich Logo"
                        width={24}
                        height={24}
                        className="h-6 w-auto object-contain rounded-[5px]"
                      />
                      <span className="font-display font-semibold tracking-tight dark:text-zinc-50">Kubb Zürich</span>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs leading-relaxed">
                      Die Plattform für die Zürcher Kubb-Szene. Von Spielern für Spieler entwickelt.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm mb-4">Navigation</h4>
                    <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                      <li><Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Startseite</Link></li>
                      <li><Link href="/tournaments" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Turniere</Link></li>
                      <li><Link href="/gallery" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Galerie</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm mb-4">Rechtliches</h4>
                    <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                      <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Impressum</Link></li>
                      <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Datenschutz</Link></li>
                      <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Kontakt</Link></li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">© 2024 Kubb Zürich. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

