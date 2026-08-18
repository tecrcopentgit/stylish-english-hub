import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";

import "./globals.css";
import "aos/dist/aos.css";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientInitializer from "@/components/ClientInitialzer";

// Logo
import logo from "@/assets/stylish_english_hub.jpeg";

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

/*
|--------------------------------------------------------------------------
| SEO METADATA
|--------------------------------------------------------------------------
*/

export const metadata: Metadata = {
  /*
  |--------------------------------------------------------------------------
  | Website URL
  |--------------------------------------------------------------------------
  */

  metadataBase: new URL("https://www.stylish-eng-hub.in"),

  /*
  |--------------------------------------------------------------------------
  | TITLE
  |--------------------------------------------------------------------------
  */

  title: {
    default:
      "Stylish English Academy | Best English Academy in Melapalayam, Tirunelveli",

    template: "%s | Stylish English Academy",
  },


  /*
  |--------------------------------------------------------------------------
  | DESCRIPTION
  |--------------------------------------------------------------------------
  */

  description:
    "Stylish English Academy is an English learning academy in Melapalayam, Tirunelveli, offering spoken English, English fluency, communication skills, public speaking and academic support.",

  /*
  |--------------------------------------------------------------------------
  | AUTHOR
  |--------------------------------------------------------------------------
  */

   verification: {
    google: "Vli_8-_s0WfiJ5OWKwAUt6VnZedQxK6ek-93hzlYwnk", //Vli_8-_s0WfiJ5OWKwAUt6VnZedQxK6ek-93hzlYwnk
  },


  authors: [
    {
      name: "Stylish English Academy",
    },
  ],

  creator: "Stylish English Academy",

  publisher: "Stylish English Academy",

  /*
  |--------------------------------------------------------------------------
  | KEYWORDS
  |--------------------------------------------------------------------------
  |
  | Note:
  | Google does not use the meta keywords tag for ranking.
  | These keywords are still included because you requested them.
  |
  */

  keywords: [
    "Stylish English Academy",

    "Best English Academy in Melapalayam",
    "English Academy in Melapalayam",
    "English Academy in Tirunelveli",
    "Best English Academy in Tirunelveli",

    "Spoken English Classes in Melapalayam",
    "Spoken English Classes in Tirunelveli",

    "English Speaking Course in Melapalayam",
    "English Speaking Course in Tirunelveli",

    "English Communication Classes in Melapalayam",
    "English Communication Classes in Tirunelveli",

    "English Fluency Training in Melapalayam",
    "English Fluency Training in Tirunelveli",

    "English Language Institute in Tirunelveli",
    "English Training Institute in Tirunelveli",

    "English Classes in Melapalayam",
    "English Classes in Tirunelveli",

    "Spoken English Institute in Tirunelveli",
    "English Communication Training in Tirunelveli",

    "Public Speaking Classes in Tirunelveli",
    "English Grammar Classes in Tirunelveli",

    "Academic Tuition in Melapalayam",
    "Student Development in Tirunelveli",
    "Personality Development in Tirunelveli",
  ],

  /*
  |--------------------------------------------------------------------------
  | CANONICAL
  |--------------------------------------------------------------------------
  */

  alternates: {
    canonical: "/",
  },

  /*
  |--------------------------------------------------------------------------
  | ROBOTS
  |--------------------------------------------------------------------------
  */

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,

      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  /*
  |--------------------------------------------------------------------------
  | FAVICON / LOGO
  |--------------------------------------------------------------------------
  */

  icons: {
    icon: logo,

    shortcut: logo,

    apple: logo,
  },

  /*
  |--------------------------------------------------------------------------
  | OPEN GRAPH
  |--------------------------------------------------------------------------
  */

  openGraph: {
    type: "website",

    locale: "en_IN",

    url: "https://www.stylish-eng-hub.in/",

    siteName: "Stylish English Academy",

    title:
      "Stylish English Academy | Best English Academy in Melapalayam, Tirunelveli",

    description:
      "Learn spoken English, improve communication skills and build English fluency at Stylish English Academy in Melapalayam, Tirunelveli.",

    /*
     * Using your imported logo instead of public/opengraph-image.jpg
     */
    images: [
      {
        url: logo,

        alt: "Stylish English Academy Logo",

        /*
         * If your actual logo dimensions are different,
         * these values should ideally match the real dimensions.
         */
        width: 512,
        height: 512,
      },
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | TWITTER / X
  |--------------------------------------------------------------------------
  */

  twitter: {
    card: "summary",

    title:
      "Stylish English Academy | English Academy in Melapalayam, Tirunelveli",

    description:
      "Spoken English, English fluency, communication skills and academic support in Melapalayam, Tirunelveli.",

    images: [logo],
  },
};

/*
|--------------------------------------------------------------------------
| ROOT LAYOUT
|--------------------------------------------------------------------------
*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable}`}
    >
      <head>
        {/*
        --------------------------------------------------------------------
        Tamil Font
        --------------------------------------------------------------------
        */}

        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            <ClientInitializer>
              {children}
            </ClientInitializer>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
