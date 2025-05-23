import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "@/app/_components/footer.css";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import { ThemeProvider } from "@/app/_components/providers/theme-provider";
import { AuthProvider } from "@/app/_components/providers/auth-provider";
import { LibraryLoader } from "@/app/_components/providers/library-loader";

// font used on fastnear.com
const dmSans = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "API Marketplace",
  description: "NEAR Protocol API Marketplace offering blockchain indexing and AI-powered endpoints through a unified credit system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.className} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <ThemeProvider>
            <LibraryLoader
              src="/lib/near.js"
              id="fastnear-lib"
            >
              <Navbar />
              <main className="flex-1 flex flex-col">{children}</main>
              <Footer />
            </LibraryLoader>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
