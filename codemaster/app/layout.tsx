import { GeistSans } from "geist/font/sans";
import logo from "../assets/CodeMaster-logo.jpg";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "CodeMaster",
  description: "The best place to learn how to code",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <link rel="icon" type="image/jpg" href={logo.src}/>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
        <ToastContainer />
        <NextTopLoader />
      </body>
    </html>
  );
}
