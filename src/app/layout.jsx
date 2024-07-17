import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "../components/Nav/Nav";
import Footer from "../components/footer/Footer";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MoviesConv 2.0 | La mejor aplicación para ver películas y series",
  description:
    "Una aplicación para ver películas y series de televisión. Explora la fascinante colección de películas y series, descubre nuevos títulos y disfruta de una experiencia cinematográfica inmersiva como nunca antes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <body className={inter.className}>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
