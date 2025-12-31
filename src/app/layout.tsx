import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import ChatbotWidget from "./components/chatbot-widget";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeWrapper from "./components/theme-wrapper";
import ReactQueryProvider from "./providers/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PCPrimeDZ - Matériel Informatique en Algérie",
    template: "%s | PCPrimeDZ"
  },
  description: "Votre destination pour le matériel informatique en Algérie. PC gaming, composants, périphériques et solutions professionnelles.",
  keywords: ["ordinateur", "gaming", "PC", "composants", "Algérie", "informatique", "matériel"],
  authors: [{ name: "PCPrimeDZ" }],
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    siteName: "PCPrimeDZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon-new.ico" type="image/x-icon" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Default to light theme if localStorage is not available
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-16 md:pt-[72px]`}
      >
        <ReactQueryProvider>
          <ThemeProvider>
            <ThemeWrapper>
              <CartProvider>
                <WishlistProvider>
                  <Navbar />
                  {children}
                  <Footer />
                  <ChatbotWidget />
                </WishlistProvider>
              </CartProvider>
            </ThemeWrapper>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
