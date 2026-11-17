import Script from "next/script";
import "./globals.css";
import Chrome from "../components/Chrome";

export const metadata = {
  metadataBase: new URL("https://privacysek.com"),
  icons: { icon: "/logo-mark.png", apple: "/icon-512.png" },
};

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0B1220" };

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Montserrat:wght@800&display=swap" />
      </head>
      <body>
        <Chrome position="top" />
        {children}
        <Chrome position="bottom" />
        {/* All interactions: menus, popup, tabs, steppers, DPIA tool, globe, graph, scroll reset */}
        <Script src="/site.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
