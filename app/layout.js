import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Maruti Pharma - Inspiring New Hope For Healthy Life",
  description: "At Maruti Pharma, we combine scientific expertise, quality manufacturing and innovative ideas to create healthcare solutions that make a meaningful difference in people's lives.",
  icons: {
    icon: "/assets/images/Maruti-Pharma-favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="stylesheet" href="/assets/css/slick.min.css" />
        <link rel="stylesheet" href="/assets/css/slick-theme.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
