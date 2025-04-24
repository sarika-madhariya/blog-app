import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Providers from "./lib/Providers";
import App from "./App";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Blog App",
  description: "Different Categories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
        <Providers>
          <div className="sticky top-0 z-50 bg-magnolia">

            <Navbar />
          </div>
          <div>
            <App>
              {children}
            </App>

          </div>
        </Providers>
      </body>
    </html>
  );
}
