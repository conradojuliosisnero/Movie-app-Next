import Head from "next/head";
import Nav from "../components/Nav/Nav";
import "../app/globals.css";
import { Inter } from "next/font/google";
import Footer from "../components/footer/Footer";
import { MOVIEDETAILS } from "../data/data";
import { SERIEDETAILS } from "../data/data";

const inter = Inter({
  subsets: ["latin"],
  weights: [300, 400, 600],
});

export default function MovieLayout({ children, type }) {
  const data = type === "movie" ? MOVIEDETAILS : SERIEDETAILS;

  return (
    <div className={inter.className}>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
      </Head>
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
