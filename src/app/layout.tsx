import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stylish English Academy | Academic Learning & English Fluency",
  description:
    "Stylish English Academy in Melapalayam, Tirunelveli, provides academic tuition, Spoken English training, communication skills, reading practice, public speaking, handwriting development, and student guidance.",
  keywords: [
    "Stylish English Academy",
    "Spoken English Classes in Melapalayam",
    "English Fluency Training in Tirunelveli",
    "Academic Tuition in Melapalayam",
    "Communication Skills",
    "Reading Practice",
    "Public Speaking",
    "Student Development",
    "Personality Development",
    "Homework Support",
  ],
  authors: [{ name: "Stylish English Academy" }],
  openGraph: {
    title: "Stylish English Academy | Learn Today, Lead Tomorrow",
    description:
      "Empowering students through academic excellence, English fluency, communication skills, and confidence-building activities in Melapalayam, Tirunelveli.",
    type: "website",
    locale: "en_IN",
    siteName: "Stylish English Academy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
