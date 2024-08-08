import { Inter } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "MoviesCon 2.0 | The ultimate movie app",
  description: "site for viewing details of movies and series",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
